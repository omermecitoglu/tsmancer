import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export function flattenSchema(
  schema: SchemaObject | ReferenceObject,
  schemaComponents: Record<string, SchemaObject>,
): SchemaObject {
  if ("$ref" in schema) {
    const [_, __, _category, componentName] = schema.$ref.split("/");
    if (!componentName || !schemaComponents[componentName]) {
      throw new Error(`Schema not found (${componentName})`);
    }
    return flattenSchema(schemaComponents[componentName], schemaComponents);
  }
  if (schema.type === "object") {
    return {
      ...schema,
      properties: schema.properties && Object.fromEntries(Object.entries(schema.properties).map(([propName, propSchema]) => {
        return [propName, flattenSchema(propSchema, schemaComponents)] as const;
      })),
    };
  }
  if (schema.type === "array") {
    return {
      ...schema,
      items: [schema.items].flat().map(item => flattenSchema(item, schemaComponents)),
    };
  }
  return schema;
}
