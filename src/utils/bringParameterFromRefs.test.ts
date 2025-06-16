import { describe, expect, it } from "vitest";
import { bringParameterFromRefs } from "./bringParameterFromRefs";
import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";

describe("bringParameterFromRefs", () => {
  it("should resolve a valid $ref to a parameter", () => {
    const input: ReferenceObject = { $ref: "#/components/parameters/ValidParam" };
    const components: ComponentsObject = {
      parameters: {
        ValidParam: { name: "testParam", in: "query" },
      },
    };
    const output = bringParameterFromRefs(input, components);
    expect(output).toEqual({ name: "testParam", in: "query" });
  });

  it("should throw an error for an invalid $ref", () => {
    const input: ReferenceObject = { $ref: "#/components/invalid/InvalidParam" };
    const components: ComponentsObject = {};
    expect(() => bringParameterFromRefs(input, components)).toThrow("Invalid $ref");
  });

  it("should throw an error for a nonexistent component", () => {
    const input: ReferenceObject = { $ref: "#/components/parameters/MissingParam" };
    const components: ComponentsObject = {
      parameters: undefined,
    };
    expect(() => bringParameterFromRefs(input, components)).toThrow("Component not found");
  });

  it("should return the input directly when it is not a $ref", () => {
    const input: ParameterObject = { name: "directParam", in: "header" };
    const components: ComponentsObject = {};
    const output = bringParameterFromRefs(input, components);
    expect(output).toEqual(input);
  });
});
