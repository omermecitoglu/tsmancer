import { findSchemaName } from "~/core/schema-db";
import render from "~/core/template";
import { bringParameterFromRefs } from "~/utils/bringParameterFromRefs";
import { bringRequestBodyFromRefs } from "~/utils/bringRequestBodyFromRefs";
import { bringResponseFromRefs } from "~/utils/bringResponseFromRefs";
import { createParametersSchema } from "~/utils/createParametersSchema";
import { getJsonSchema } from "~/utils/getJsonSchema";
import template from "./operation.hbs";
import type { OperationObject } from "@omer-x/openapi-types/operation";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

type Template = {
  importedItems: string[],
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  endpoint: string,
  operationId: string,
  jsDoc: string[],
  pathParameters: {
    name: string,
    schemaName: string,
  }[],
  queryParameters: null | {
    schemaName: string | null,
  },
  requestBody: null | {
    schemaName: string | null,
  },
  responses: {
    statusCode: string,
    schemaName: string | null,
  }[],
};

export function generateOperation(
  method: Template["method"],
  pathName: string,
  operation: OperationObject,
  schemaDB: Record<string, SchemaObject> = {},
) {
  if (!operation.operationId) throw new Error("operationId is missing");

  const parameters = (operation.parameters ?? []).map(parameter => bringParameterFromRefs(parameter, {}));
  const pathParameters = parameters.filter(parameter => parameter.in === "path");
  const queryParameters = parameters.filter(parameter => parameter.in === "query");
  const queryParametersSchema = createParametersSchema(queryParameters);
  const requestBody = operation.requestBody && bringRequestBodyFromRefs(operation.requestBody, {});

  const jsDoc: string[] = [];
  if (operation.deprecated) {
    jsDoc.push("@deprecated This operation is deprecated.", "");
  }
  if (operation.summary) {
    jsDoc.push(operation.summary, "");
  }
  if (operation.description) {
    jsDoc.push(operation.description, "");
  }
  for (const pathParameter of pathParameters) {
    jsDoc.push(`@param ${pathParameter.name} - ${pathParameter.description || "missing-description"}`);
  }
  if (queryParameters.length) {
    jsDoc.push("@param queryParams - Query Parameters");
  }
  if (requestBody) {
    jsDoc.push("@param requestBody - Request Body");
  }

  const options = {
    method,
    endpoint: pathParameters.length ? `\`${pathName.replaceAll("{", "${")}\`` : `"${pathName}"`,
    operationId: operation.operationId,
    jsDoc,
    pathParameters: pathParameters.map(parameter => ({
      name: parameter.name,
      schemaName: (parameter.schema && findSchemaName(parameter.schema, schemaDB)) ?? "unknown",
    })),
    queryParameters: !queryParameters.length ? null : {
      schemaName: findSchemaName(queryParametersSchema, schemaDB),
    },
    requestBody: !requestBody ? null : {
      schemaName: findSchemaName(getJsonSchema(requestBody), schemaDB),
    },
    responses: Object.entries(operation.responses ?? {}).map(([statusCode, response]) => {
      const res = bringResponseFromRefs(response, {});
      return {
        statusCode,
        schemaName: findSchemaName(getJsonSchema(res), schemaDB),
      };
    }),
  };

  return render<Template>(template)({
    ...options,
  });
}
