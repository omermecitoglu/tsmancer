import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

/**
 * Creates a schema object from an array of path parameters.
 *
 * @param pathParameters - The array of path parameters.
 * @returns The schema object or null if no path parameters are provided.
 */
export function createParametersSchema(pathParameters: ParameterObject[]): SchemaObject | null {
  if (!pathParameters.length) return null;
  return {
    type: "object",
    required: pathParameters.filter(parameter => parameter.required).map(parameter => parameter.name),
    properties: Object.fromEntries(pathParameters.map(parameter => {
      return [parameter.name, parameter.schema ?? { type: "null" }] as const;
    })),
    additionalProperties: false,
  };
}
