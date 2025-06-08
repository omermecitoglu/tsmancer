import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export function createParametersSchema(pathParameters: ParameterObject[]): SchemaObject {
  return {
    type: "object",
    required: pathParameters.filter(parameter => parameter.required).map(parameter => parameter.name),
    properties: Object.fromEntries(pathParameters.map(parameter => {
      return [parameter.name, parameter.schema ?? { type: "null" }] as const;
    })),
    additionalProperties: false,
  };
}
