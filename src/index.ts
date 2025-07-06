#!/usr/bin/env node
import fs from "fs/promises";
import path from "node:path";
import { Command } from "commander";
import { createProgram } from "typescript";
import generateConfigs from "./core/configs";
import { fetchOpenApiSpec } from "./core/fetchOpenApiSpec";
import { createFile } from "./core/file";
import { generateInterface } from "./templates/interface";
import { generateOperation } from "./templates/operation";
import { generateSchema } from "./templates/schema";
import { generateUtilForURL } from "./templates/utils/createURL";
import { generateUtilForZod } from "./templates/utils/parseZodSchema";
import { generateZodSchema } from "./templates/zod-schema";

const program = new Command();

program
  .option("-s, --source <path>", "Specify the source URL (swagger.json)")
  .option("-o, --output <path>", "Specify the output directory", "dist");

program.parse();

const options = program.opts<{ source: string, output: string }>();

(async () => {
  try {
    const sourceURL = options.source;
    if (!sourceURL && !process.env.OPENAPI_SRC) {
      throw new Error("Source URL is not specified");
    }

    const outputFolder = options.output;
    const outputDir = path.resolve(process.cwd(), outputFolder);
    await fs.rm(path.resolve(outputDir, "src"), { recursive: true, force: true });
    await fs.rm(path.resolve(outputDir, "dist"), { recursive: true, force: true });

    const src = sourceURL || process.env.OPENAPI_SRC;
    if (!src) throw new Error("Invalid source");
    const spec = await fetchOpenApiSpec(src);
    if (!spec) return;
    if (!spec.paths) throw new Error("Couldn't find any valid path");

    const schemaDatabase = spec.components?.schemas ?? {};
    const operationIds: Record<string, string[]> = {};

    for (const [pathName, methods] of Object.entries(spec.paths)) {
      for (const [methodName, operation] of Object.entries(methods)) {
        const method = methodName.toUpperCase();
        if (method !== "GET" && method !== "POST" && method !== "PATCH" && method !== "PUT" && method !== "DELETE") continue;
        if (typeof operation !== "object") continue;
        if ("operationId" in operation && operation.operationId) {
          const tags = (operation.tags ?? []).join(", ") || "Misc.";
          operationIds[tags] = [...(operationIds[tags] ?? []), operation.operationId];
          await createFile(
            generateOperation(method, pathName, operation, schemaDatabase, spec.components),
            `${operation.operationId}.ts`,
            outputDir,
            "src/operations",
          );
        }
      }
    }

    for (const [schemaName, schema] of Object.entries(schemaDatabase)) {
      await createFile(
        generateSchema(schemaName, schema),
        `${schemaName}.ts`,
        outputDir,
        "src/schemas",
      );
      await createFile(
        generateZodSchema(schemaName, schema),
        `${schemaName}.ts`,
        outputDir,
        "src/zod-schemas",
      );
    }

    await createFile(generateUtilForURL("API_BASE_URL"), "createURL.ts", outputDir, "src/utils");
    await createFile(generateUtilForZod(), "parseZodSchema.ts", outputDir, "src/utils");
    const filePath = await createFile(generateInterface(operationIds), "index.ts", outputDir, "src");

    const tsProgram = createProgram([filePath], {
      declaration: true,
      outDir: path.resolve(outputDir, "dist"),
      module: 99,
      target: 99,
      strict: true,
    });

    tsProgram.emit();

    await fs.rm(path.resolve(outputDir, "src"), { recursive: true });

    await createFile(generateConfigs("dist", []) + "\n", "package.json", outputDir);
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
})();
