import { generateZodSchema as generate, generateZodType } from "@omer-x/json-schema-to-zod";
import render from "~/core/template";
import zodSchemaTemplate from "./zod-schema.hbs";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

type Template = {
  dependencies: string[],
  schemaName: string,
  zodType: string,
  zodSchema: string,
};

export function generateZodSchema(schemaName: string, schema: SchemaObject) {
  const zodSchema = generate(schema);
  const zodType = generateZodType(schema);

  return render<Template>(zodSchemaTemplate)({
    dependencies: zodSchema.dependencies,
    schemaName,
    zodType: zodSchema.dependencies.reduce((body, dependency) => {
      return body.replace(dependency, `typeof ${dependency}`);
    }, zodType.body),
    zodSchema: zodSchema.body,
  });
}
