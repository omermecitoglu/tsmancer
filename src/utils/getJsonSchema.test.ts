import { describe, expect, it } from "vitest";
import { getJsonSchema } from "./getJsonSchema";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ResponseObject } from "@omer-x/openapi-types/response";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("getJsonSchema", () => {
  it("should return null if input has no content", () => {
    const input = {} as ResponseObject;
    const output = getJsonSchema(input);
    expect(output).toBeNull();
  });

  it("should return null if content does not have application/json", () => {
    const input: ResponseObject = {
      content: {
        "text/plain": {
          schema: { type: "string" },
        },
      },
      description: "example",
    };
    const output = getJsonSchema(input);
    expect(output).toBeNull();
  });

  it("should return null if application/json has no schema", () => {
    const input: RequestBodyObject = {
      content: {
        "application/json": {},
      },
    };
    const output = getJsonSchema(input);
    expect(output).toBeNull();
  });

  it("should return the schema if application/json has a schema", () => {
    const schema: SchemaObject = { type: "object", properties: { name: { type: "string" } } };
    const input: RequestBodyObject = {
      content: {
        "application/json": { schema },
      },
    };
    const output = getJsonSchema(input);
    expect(output).toBe(schema);
  });
});
