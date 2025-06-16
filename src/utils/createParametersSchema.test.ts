import { describe, expect, it } from "vitest";
import { createParametersSchema } from "./createParametersSchema";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";

describe("createParametersSchema", () => {
  it("should return null if no path parameters are provided", () => {
    const result = createParametersSchema([]);
    expect(result).toBeNull();
  });

  it("should create a schema object with required and optional properties", () => {
    const pathParameters: ParameterObject[] = [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
      { in: "path", name: "name", required: false, schema: { type: "string" } },
    ];

    const result = createParametersSchema(pathParameters);

    expect(result).toEqual({
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
      additionalProperties: false,
    });
  });

  it("should handle parameters without a schema by assigning type 'null'", () => {
    const pathParameters: ParameterObject[] = [
      { in: "path", name: "id", required: true },
    ];

    const result = createParametersSchema(pathParameters);

    expect(result).toEqual({
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "null" },
      },
      additionalProperties: false,
    });
  });
});
