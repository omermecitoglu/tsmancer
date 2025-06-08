#!/usr/bin/env node
import path from "node:path";
import getArgument from "./generator/arguments";
import fetchOpenApiSpec from "./generator/fetchOpenApiSpec";
import createFile from "./generator/file";
import { generateInterface } from "./templates/interface";
import { generateOperation } from "./templates/operation";
import { generateSchema } from "./templates/schema";

(async () => {
  try {
    const sourceURL = await getArgument("source") ?? null;
    if (!sourceURL && !process.env.OPENAPI_SRC) {
      throw new Error("Source URL is not specified");
    }

    const outputFolder = await getArgument("output") ?? "dist";
    const outputDir = path.resolve(process.cwd(), outputFolder);

    const src = sourceURL ?? process.env.OPENAPI_SRC;
    if (!src) throw new Error("Invalid source");
    const spec = await fetchOpenApiSpec(src);
    if (!spec) return;
    if (!spec.paths) throw new Error("Couldn't find any valid path");

    const schemaDatabase = spec.components?.schemas ?? {};
    const operations: string[] = [];

    for (const [pathName, methods] of Object.entries(spec.paths)) {
      for (const [methodName, operation] of Object.entries(methods)) {
        const method = methodName.toUpperCase();
        if (method !== "GET" && method !== "POST" && method !== "PATCH" && method !== "PUT" && method !== "DELETE") continue;
        if (typeof operation !== "object") continue;
        if ("operationId" in operation) {
          operations.push(generateOperation(method, pathName, operation, schemaDatabase));
        }
      }
    }

    for (const [schemaName, schema] of Object.entries(schemaDatabase)) {
      if (!schema.type) continue;
      await createFile(
        generateSchema(schemaName, schema, spec.components?.schemas ?? {}),
        `${schemaName}.ts`,
        outputDir,
        "dist/schemas",
      );
    }

    const tsCode = generateInterface("API_BASE_URL", Object.keys(schemaDatabase), operations);

    const filePath = await createFile(
      tsCode,
      "index.ts",
      outputDir,
      "dist",
    );

    /* const program = createProgram([filePath], {
      declaration: true,
      outDir: "./types",
      module: 99,
      target: 99,
      strict: true,
    });

    program.emit(); */
  } catch (error) {
    console.log("loooo");
    if (error && typeof error === "object" && "messagee" in error) {
      // eslint-disable-next-line no-console
      console.log(error.messagee);
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
})();
