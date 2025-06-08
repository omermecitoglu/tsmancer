import { describe, expect, it } from "@jest/globals";
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
    const output = generateSchema("UserDTO", input);
    expect(output).toContain('import { z } from "zod/v4";');
    expect(output).toContain('export const schemaOfUserDTO = z.object({ "name": z.string(), "age": z.number() }).strict();');
    expect(output).toContain("export type UserDTO = z.infer<typeof schemaOfUserDTO>;");
  });
});
