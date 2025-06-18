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
    expect(output).toContain("type UserDTO = ");
    expect(output).toContain("name: string,");
    expect(output).toContain("age: number,");
    expect(output).toContain("export default UserDTO;");
  });
});
