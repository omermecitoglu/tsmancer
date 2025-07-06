import { generateTypeDefinition } from "@omer-x/typesculptor";
import render from "~/core/template";
import schemaTemplate from "./schema.hbs";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

type Template = {
  dependencies: string[],
  schemaName: string,
  description: string,
  body: string,
};

export function generateSchema(schemaName: string, schema: SchemaObject) {
  const { dependencies, body } = generateTypeDefinition(schema);
  return render<Template>(schemaTemplate)({
    dependencies,
    schemaName,
    description: schema.description ?? "missing-description",
    body,
  });
}
