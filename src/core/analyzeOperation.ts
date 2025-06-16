import { bringParameterFromRefs } from "~/utils/bringParameterFromRefs";
import { bringRequestBodyFromRefs } from "~/utils/bringRequestBodyFromRefs";
import { bringResponseFromRefs } from "~/utils/bringResponseFromRefs";
import { createParametersSchema } from "~/utils/createParametersSchema";
import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { OperationObject } from "@omer-x/openapi-types/operation";

/**
 * Analyzes an OpenAPI operation object and extracts relevant details.
 *
 * @param operation - The OpenAPI operation object to analyze.
 * @param components - The OpenAPI components object containing reusable definitions.
 */
export function analyzeOperation(operation: OperationObject, components: ComponentsObject) {
  if (!operation.operationId) throw new Error("operationId is missing");

  const parameters = (operation.parameters ?? []).map(parameter => bringParameterFromRefs(parameter, components));
  const pathParameters = parameters.filter(parameter => parameter.in === "path");
  const queryParameters = parameters.filter(parameter => parameter.in === "query");
  const requestBody = (operation.requestBody && bringRequestBodyFromRefs(operation.requestBody, components)) ?? null;
  const responses = Object.fromEntries(Object.entries(operation.responses ?? {}).map(([statusCode, response]) => {
    return [statusCode, bringResponseFromRefs(response, components)] as const;
  }));

  return {
    id: operation.operationId,
    pathParameters,
    queryParameters: createParametersSchema(queryParameters),
    requestBody,
    responses,
  };
}
