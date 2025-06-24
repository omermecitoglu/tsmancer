import { describe, expect, it } from "vitest";
import { generateUtilForZod } from "./parseZodSchema";

describe("generateUtilForZod", () => {
  it("should generate a Zod schema parsing function", () => {
    const result = generateUtilForZod();
    expect(result).toContain("import { type ZodType, type z } from \"zod/v4\";");
    expect(result).toContain("export function parseZodSchema");
    // expect(result).toContain("schema.safeParse(data)");
    // expect(result).toContain("if (!result.success) throw result.error;");
    // expect(result).toContain("return result.data;");
  });
});
