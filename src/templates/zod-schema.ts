import { generateZodSchema as generate, generateZodType } from "@omer-x/json-schema-to-zod";
import render from "~/core/template";
import zodSchemaTemplate from "./zod-schema.hbs";
import type { SchemaObject } from "@omer-x/json-schema-types";

type Template = {
  dependencies: string[],
  schemaName: string,
  zodType: string,
  zodSchema: string,
  zodSource: string,
};

export function generateZodSchema(schemaName: string, schema: SchemaObject, registry: string) {
  const zodSchema = generate(schema);
  const zodType = generateZodType(schema);

  return render<Template>(zodSchemaTemplate)({
    dependencies: zodSchema.dependencies,
    schemaName,
    zodType: zodSchema.dependencies.reduce((body, dependency) => {
      return body.replace(dependency, `typeof ${dependency}`);
    }, zodType.body),
    zodSchema: zodSchema.body,
    zodSource: registry === "jsr" ? "npm:zod@4" : "zod",
  });
}
