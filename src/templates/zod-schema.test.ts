import { describe, expect, it } from "vitest";
import { generateZodSchema } from "./zod-schema";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("generateZodSchema", () => {
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
    const output = generateZodSchema("UserDTO", input, {});
    expect(output).toContain('import { type ZodType, z } from "zod/v4";');
    expect(output).toContain('import type UserDTO from "../schemas/UserDTO";');
    expect(output).toContain('z.object({ "name": z.string(), "age": z.number() }).strict()');
    expect(output).toContain(" as unknown as ZodType<UserDTO, UserDTO>;");
  });
});
