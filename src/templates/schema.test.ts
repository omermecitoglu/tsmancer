import { describe, expect, it } from "vitest";
import { generateSchema } from "./schema";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("generateSchema", () => {
  it("should generate a valid Zod schema and type", () => {
    const input: SchemaObject = {
      type: "object",
      required: ["name", "age"],
      properties: {
        name: {
          type: "string",
        },
        age: {
          type: "number",
        },
      },
      additionalProperties: false,
    };
    const output = generateSchema("UserDTO", input, {});
    expect(output).toContain('import { type ZodType, z } from "zod/v4";');
    expect(output).toContain("export type UserDTO = ");
    expect(output).toContain("name: string,");
    expect(output).toContain("age: number,");
    expect(output).toContain("export const schemaOfUserDTO = ");
    expect(output).toContain('z.object({ "name": z.string(), "age": z.number() }).strict()');
    expect(output).toContain(" as unknown as ZodType<UserDTO, UserDTO>;");
  });
});
