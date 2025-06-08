import { jsonSchemaToZod } from "json-schema-to-zod";
import render from "~/core/template";
import { flattenSchema } from "~/utils/flattenSchema";
import template from "./schema.hbs";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

type Template = {
  schemaName: string,
  zodSchema: string,
};

export function generateSchema(schemaName: string, schema: SchemaObject, schemaComponents: Record<string, SchemaObject>) {
  return render<Template>(template)({
    schemaName,
    zodSchema: jsonSchemaToZod(flattenSchema(schema, schemaComponents)),
  });
}
