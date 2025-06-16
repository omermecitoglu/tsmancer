import { describe, expect, it } from "vitest";
import { bringRequestBodyFromRefs } from "./bringRequestBodyFromRefs";
import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";

describe("bringRequestBodyFromRefs", () => {
  it("should return the correct request body for a valid $ref", () => {
    const input: ReferenceObject = { $ref: "#/components/requestBodies/ValidRequestBody" };
    const components: ComponentsObject = {
      requestBodies: {
        ValidRequestBody: {
          content: {
            "application/json": {
              schema: { type: "object" as const, properties: { key: { type: "string" } } },
            },
          },
        },
      },
    };
    const output = bringRequestBodyFromRefs(input, components);
    expect(output).toEqual({
      content: {
        "application/json": {
          schema: { type: "object" as const, properties: { key: { type: "string" } } },
        },
      },
    });
  });

  it("should throw an error for an invalid $ref", () => {
    const input: ReferenceObject = { $ref: "#/components/invalid/ValidRequestBody" };
    const components: ComponentsObject = {};
    expect(() => bringRequestBodyFromRefs(input, components)).toThrow("Invalid $ref");
  });

  it("should throw an error for a nonexistent component", () => {
    const input: ReferenceObject = { $ref: "#/components/requestBodies/MissingRequestBody" };
    const components: ComponentsObject = {
      requestBodies: undefined,
    };
    expect(() => bringRequestBodyFromRefs(input, components)).toThrow("Component not found");
  });

  it("should return the input directly when it is not a $ref", () => {
    const input: RequestBodyObject = {
      content: {
        "application/json": {
          schema: { type: "object" as const, properties: { key: { type: "string" } } },
        },
      },
    };
    const components: ComponentsObject = {};
    const output = bringRequestBodyFromRefs(input, components);
    expect(output).toEqual(input);
  });
});
