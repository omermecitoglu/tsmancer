import { describe, expect, it } from "vitest";
import { analyzeOperation } from "./analyzeOperation";
import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { OperationObject } from "@omer-x/openapi-types/operation";

describe("analyzeOperation", () => {
  const mockComponents: ComponentsObject = {
    schemas: {},
    responses: {},
    parameters: {},
    requestBodies: {},
  };

  it("should throw an error if operationId is missing", () => {
    const operation: OperationObject = {};

    expect(() => analyzeOperation(operation, mockComponents)).toThrow("operationId is missing");
  });

  it("should analyze operation with parameters and request body", () => {
    const operation: OperationObject = {
      operationId: "testOperation",
      parameters: [
        { in: "path", name: "id", required: true },
        { in: "query", name: "search", required: false },
      ],
      requestBody: {
        description: "Test body",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Success" },
      },
    };

    const output = analyzeOperation(operation, mockComponents);
    expect(output.id).toBe(operation.operationId);
    expect(output.pathParameters).toStrictEqual([{ in: "path", name: "id", required: true }]);
    expect(output.queryParameters).toStrictEqual({
      additionalProperties: false,
      properties: {
        search: {
          type: "null",
        },
      },
      required: [],
      type: "object",
    });
    expect(output.requestBody).toStrictEqual(operation.requestBody);
    expect(output.responses).toStrictEqual(operation.responses);
  });

  it("should handle operations without parameters or request body", () => {
    const operation: OperationObject = {
      operationId: "testOperation",
      responses: {
        404: { description: "Not Found" },
      },
    };

    const output = analyzeOperation(operation, mockComponents);

    expect(output).toEqual({
      id: "testOperation",
      pathParameters: [],
      queryParameters: null,
      requestBody: null,
      responses: {
        404: { description: "Not Found" },
      },
    });
  });

  it("should analyze operation with path and query parameters", () => {
    const operation: OperationObject = {
      operationId: "testOperationWithParams",
      parameters: [
        { in: "path", name: "userId", required: true },
        { in: "query", name: "filter", required: false },
      ],
    };

    const output = analyzeOperation(operation, mockComponents);

    expect(output.pathParameters).toStrictEqual([{ in: "path", name: "userId", required: true }]);
    expect(output.queryParameters).toStrictEqual({
      additionalProperties: false,
      properties: {
        filter: {
          type: "null",
        },
      },
      required: [],
      type: "object",
    });
  });
});
