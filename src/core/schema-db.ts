import crypto from "node:crypto";
import deepEqual from "../utils/deepEqual";
import type { SchemaObject } from "@omer-x/json-schema-types";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";

/**
 * Finds the name of a schema in the database or generates a new name if not found.
 *
 * @param targetSchema - The schema to find or add to the database.
 * @param database - The database of schemas.
 * @returns The name of the schema if found or generated, otherwise null.
 */
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
  const schemaName = "Schema" + crypto.randomUUID().toUpperCase().replaceAll("-", "");
  database[schemaName] = targetSchema;
  return schemaName;
}
