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
    const output = generateZodSchema("UserDTO", input);
    expect(output).toContain('import { z } from "zod";');
    expect(output).toContain("export type TypeOfUserDTO = z.ZodObject<{");
    expect(output).toContain("name: z.ZodString,");
    expect(output).toContain("age: z.ZodNumber,");
    expect(output).toContain("export const schemaOfUserDTO = z.strictObject({");
    expect(output).toContain("name: z.string(),");
    expect(output).toContain("age: z.number(),");
    expect(output).toContain("}) as unknown as TypeOfUserDTO;");
  });

  it("should handle references to other schemas", () => {
    const input: SchemaObject = {
      type: "object",
      required: ["user"],
      properties: {
        user: {
          $ref: "#/components/schemas/UserDTO",
        },
      },
      additionalProperties: false,
    };
    const output = generateZodSchema("UserResponseDTO", input);
    expect(output).toContain('import { schemaOfUserDTO as UserDTO } from "./UserDTO";');
    expect(output).toContain("export type TypeOfUserResponseDTO = z.ZodObject<{");
    expect(output).toContain("user: UserDTO,");
    expect(output).toContain("export const schemaOfUserResponseDTO = z.strictObject({");
    expect(output).toContain("user: UserDTO,");
    expect(output).toContain("}) as unknown as TypeOfUserResponseDTO;");
  });
});
