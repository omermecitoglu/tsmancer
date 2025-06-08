import { randomUUID } from "node:crypto";
import deepEqual from "../utils/deepEqual";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export function findSchemaName(
  targetSchema: SchemaObject | ReferenceObject | null,
  database: Record<string, SchemaObject>,
) {
  if (!targetSchema) return null;
  if ("$ref" in targetSchema) {
    const [_, __, _category, componentName] = targetSchema.$ref.split("/");
    if (componentName && database[componentName]) {
      return componentName;
    }
  }
  for (const [schemaName, schema] of Object.entries(database)) {
    if (deepEqual(schema, targetSchema)) {
      return schemaName;
    }
  }
  const schemaName = "Schema" + randomUUID().toUpperCase().replaceAll("-", "");
  database[schemaName] = targetSchema;
  return schemaName;
}
