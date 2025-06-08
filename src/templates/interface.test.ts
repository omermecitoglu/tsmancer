import { describe, expect, it } from "@jest/globals";
import { generateInterface } from "./interface";

describe("generateInterface", () => {
  it("should generate a valid Zod schema and type", () => {
    const output = generateInterface();
    expect(output).toContain('import { z } from "zod/v4";');
  });
});
