import { describe, expect, it } from "vitest";
import { findSchemaName } from "./schema-db";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("findSchemaName", () => {
  it("should return null if targetSchema is null", () => {
    const database: Record<string, SchemaObject> = {};
    const output = findSchemaName(null, database);
    expect(output).toBeNull();
  });

  it("should return the component name if $ref exists in targetSchema and matches database", () => {
    const database: Record<string, SchemaObject> = {
      TestSchema: { type: "string" },
    };
    const targetSchema = { $ref: "#/components/schemas/TestSchema" };
    const output = findSchemaName(targetSchema, database);
    expect(output).toBe("TestSchema");
  });

  it("should return the schema name if targetSchema matches an entry in the database", () => {
    const database: Record<string, SchemaObject> = {
      TestSchema: { type: "string" },
    };
    const targetSchema: SchemaObject = { type: "string" };
    const output = findSchemaName(targetSchema, database);
    expect(output).toBe("TestSchema");
  });

  it("should generate a new schema name if targetSchema does not match any entry in the database", () => {
    const database: Record<string, SchemaObject> = {};
    const targetSchema: SchemaObject = { type: "string" };
    const output = findSchemaName(targetSchema, database);
    expect(output).toMatch(/^Schema[A-Z0-9]+$/);
    if (output) {
      expect(database[output]).toStrictEqual(targetSchema);
    }
  });
});
