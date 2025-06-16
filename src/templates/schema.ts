import { generateTypeDefinition } from "@omer-x/typesculptor";
import { jsonSchemaToZod } from "json-schema-to-zod";
import render from "~/core/template";
import { flattenSchema } from "~/utils/flattenSchema";
import schemaTemplate from "./schema.hbs";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

type Template = {
  dependencies: string[],
  schemaName: string,
  description: string,
  body: string,
  zodSchema: string,
};

export function generateSchema(schemaName: string, schema: SchemaObject, schemaComponents: Record<string, SchemaObject>) {
  const { dependencies, body } = generateTypeDefinition(schema);
  return render<Template>(schemaTemplate)({
    dependencies,
    schemaName,
    description: schema.description ?? "missing-description",
    body,
    zodSchema: jsonSchemaToZod(flattenSchema(schema, schemaComponents)),
  });
}
