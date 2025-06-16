import { describe, expect, it } from "vitest";
import { bringResponseFromRefs } from "./bringResponseFromRefs";
import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { ResponseObject } from "@omer-x/openapi-types/response";

describe("bringResponseFromRefs", () => {
  it("should return the ResponseObject if input is not a reference", () => {
    const response: ResponseObject = {
      description: "A simple response",
    };

    const components: ComponentsObject = {
      responses: {},
    };

    const output = bringResponseFromRefs(response, components);
    expect(output).toBe(response);
  });

  it("should resolve a valid $ref and return the corresponding ResponseObject", () => {
    const components: ComponentsObject = {
      responses: {
        SuccessResponse: {
          description: "Success response",
        },
      },
    };

    const ref: ReferenceObject = {
      $ref: "#/components/responses/SuccessResponse",
    };

    const output = bringResponseFromRefs(ref, components);
    expect(output).toEqual({
      description: "Success response",
    });
  });

  it("should throw an error for an invalid $ref format", () => {
    const components: ComponentsObject = {
      responses: {},
    };

    const ref: ReferenceObject = {
      $ref: "#/components/invalid/format",
    };

    expect(() => bringResponseFromRefs(ref, components)).toThrow("Invalid $ref");
  });

  it("should throw an error if referenced component is not found", () => {
    const components: ComponentsObject = {
      responses: {},
    };

    const ref: ReferenceObject = {
      $ref: "#/components/responses/NotFound",
    };

    expect(() => bringResponseFromRefs(ref, components)).toThrow("Component not found");
  });

  it("should recursively resolve nested references", () => {
    const components: ComponentsObject = {
      responses: {
        First: {
          $ref: "#/components/responses/Second",
        },
        Second: {
          $ref: "#/components/responses/Final",
        },
        Final: {
          description: "Deep resolved response",
        },
      },
    };

    const ref: ReferenceObject = {
      $ref: "#/components/responses/First",
    };

    const output = bringResponseFromRefs(ref, components);
    expect(output).toEqual({
      description: "Deep resolved response",
    });
  });

  it("should use empty object if components[category] is undefined", () => {
    const components = {}; // no "responses" key

    const ref: ReferenceObject = {
      $ref: "#/components/responses/MissingResponse",
    };

    expect(() => bringResponseFromRefs(ref, components)).toThrow("Component not found");
  });
});
