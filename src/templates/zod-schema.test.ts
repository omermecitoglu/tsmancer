import { describe, expect, it } from "vitest";
import { generateZodSchema } from "./zod-schema";
import type { SchemaObject } from "@omer-x/json-schema-types";

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
    const output = generateZodSchema("UserDTO", input, "npm");
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
    const output = generateZodSchema("UserResponseDTO", input, "npm");
    expect(output).toContain('import { schemaOfUserDTO as UserDTO } from "./UserDTO";');
    expect(output).toContain("export type TypeOfUserResponseDTO = z.ZodObject<{");
    expect(output).toContain("user: UserDTO,");
    expect(output).toContain("export const schemaOfUserResponseDTO = z.strictObject({");
    expect(output).toContain("user: UserDTO,");
    expect(output).toContain("}) as unknown as TypeOfUserResponseDTO;");
  });

  it("should import zod from the correct source for JSR", () => {
    const output = generateZodSchema("Unknown", { type: "string" }, "jsr");
    expect(output).toContain('import { z } from "npm:zod@4";');
  });

  it("should handle when a dependency used multiple times", () => {
    const schemaName = "Schema8AD5850F407746108F55F9025613482C";
    const output = generateZodSchema(schemaName, {
      type: "object",
      required: ["offset", "limit"],
      properties: {
        offset: {
          $ref: "#/components/schemas/Schema0DFB308CE28C4ACFAAEB18F885A82CFA", // <--- this is same
        },
        limit: {
          $ref: "#/components/schemas/Schema0DFB308CE28C4ACFAAEB18F885A82CFA", // <--- this is same
        },
      },
      additionalProperties: false,
    }, "npm");
    expect(output).not.toContain("typeof typeof ");
    expect(output).toContain([
      "export type TypeOfSchema8AD5850F407746108F55F9025613482C = z.ZodObject<{",
      "\toffset: typeof Schema0DFB308CE28C4ACFAAEB18F885A82CFA,",
      "\tlimit: typeof Schema0DFB308CE28C4ACFAAEB18F885A82CFA,",
      "}>;",
    ].join("\n"));
  });
});
