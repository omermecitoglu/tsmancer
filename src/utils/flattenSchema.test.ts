import { describe, expect, it } from "vitest";
import { flattenSchema } from "./flattenSchema";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("flattenSchema", () => {
  it("should resolve a $ref schema", () => {
    const schemaComponents: Record<string, SchemaObject> = {
      TestSchema: { type: "string" },
    };
    const schema: ReferenceObject = { $ref: "#/components/schemas/TestSchema" };

    const output = flattenSchema(schema, schemaComponents);
    expect(output).toStrictEqual({ type: "string" });
  });

  it("should flatten an object schema with nested properties", () => {
    const schemaComponents: Record<string, SchemaObject> = {
      NestedSchema: { type: "number" },
    };
    const schema: SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { $ref: "#/components/schemas/NestedSchema" },
      },
    };

    const output = flattenSchema(schema, schemaComponents);
    expect(output).toStrictEqual({
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
    });
  });

  it("should flatten an array schema with items", () => {
    const schemaComponents: Record<string, SchemaObject> = {
      ItemSchema: { type: "boolean" },
    };
    const schema: SchemaObject = {
      type: "array",
      items: { $ref: "#/components/schemas/ItemSchema" },
    };

    const output = flattenSchema(schema, schemaComponents);
    expect(output).toStrictEqual({
      type: "array",
      items: [{ type: "boolean" }],
    });
  });

  it("should return the schema as-is if no $ref or nested structures exist", () => {
    const schema: SchemaObject = { type: "string" };

    const output = flattenSchema(schema, {});
    expect(output).toStrictEqual({ type: "string" });
  });

  it("should throw an error if a $ref cannot be resolved", () => {
    const schema: ReferenceObject = { $ref: "#/components/schemas/UnknownSchema" };

    expect(() => flattenSchema(schema, {})).toThrowError("Schema not found (UnknownSchema)");
  });
});
