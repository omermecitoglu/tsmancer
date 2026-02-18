import { analyzeOperation } from "~/core/analyzeOperation";
import { findSchemaName } from "~/core/schema-db";
import render from "~/core/template";
import { getJsonSchema } from "~/utils/getJsonSchema";
import operationTemplate from "./operation.hbs";
import type { SchemaObject } from "@omer-x/json-schema-types";
import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { OperationObject } from "@omer-x/openapi-types/operation";

type Template = {
  importedSchemas: {
    schemaName: string,
    validation: boolean,
  }[],
  isCacheable: boolean,
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
    schemaName: string,
  },
  responses: {
    statusCode: string,
    schemaName: string,
  }[],
};

export function generateOperation(
  method: Template["method"],
  pathName: string,
  rawOperation: OperationObject,
  schemaDB: Record<string, SchemaObject>,
  components: ComponentsObject = {},
) {
  const operation = analyzeOperation(rawOperation, components);

  const jsDoc: string[] = [];
  if (rawOperation.deprecated) {
    jsDoc.push("@deprecated This operation is deprecated.", "");
  }
  if (rawOperation.summary) {
    jsDoc.push(rawOperation.summary, "");
  }
  if (rawOperation.description) {
    jsDoc.push(rawOperation.description, "");
  }
  for (const pathParameter of operation.pathParameters) {
    jsDoc.push(`@param ${pathParameter.name} - ${pathParameter.description || "missing-description"}`);
  }
  if (operation.queryParameters) {
    jsDoc.push("@param queryParams - Query Parameters");
  }
  if (operation.requestBody) {
    jsDoc.push("@param requestBody - Request Body");
  }

  const pathParameters = operation.pathParameters.map(parameter => ({
    name: parameter.name,
    schemaName: (parameter.schema && findSchemaName(parameter.schema, schemaDB)) ?? "unknown",
  }));

  const queryParameters = operation.queryParameters && {
    schemaName: findSchemaName(operation.queryParameters, schemaDB),
  };

  const requestBody = operation.requestBody && {
    schemaName: findSchemaName(getJsonSchema(operation.requestBody), schemaDB) ?? "unknown",
  };

  const responses = Object.entries(operation.responses).map(([statusCode, response]) => ({
    statusCode,
    schemaName: findSchemaName(getJsonSchema(response), schemaDB) ?? "",
  }));

  const dependencies = [
    ...pathParameters.map(pp => ({ schemaName: pp.schemaName, validation: true })),
    ...queryParameters?.schemaName ? [{ schemaName: queryParameters.schemaName, validation: true }] : [],
    ...requestBody?.schemaName ? [{ schemaName: requestBody.schemaName, validation: true }] : [],
    ...responses.map(r => ({ schemaName: r.schemaName, validation: false })),
  ];

  return render<Template>(operationTemplate)({
    importedSchemas: dependencies.filter(dep => dep.schemaName && dep.schemaName !== "unknown"),
    isCacheable: method === "GET",
    method,
    endpoint: operation.pathParameters.length ? `\`${pathName.replaceAll("{", "${")}\`` : `"${pathName}"`,
    operationId: operation.id,
    jsDoc,
    pathParameters,
    queryParameters,
    requestBody,
    responses,
  });
}
