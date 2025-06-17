import { describe, expect, it } from "vitest";
import { generateInterface } from "./interface";

describe("generateInterface", () => {
  it("should generate the correct interface template", () => {
    const operations = {
      tag1: ["operation1", "operation2"],
      tag2: ["operation3"],
    };

    const output = generateInterface(operations);
    expect(output).toContain("/**\n * tag1\n */");
    expect(output).toContain("export { default as operation1 } from \"./operations/operation1\";");
    expect(output).toContain("export { default as operation2 } from \"./operations/operation2\";");
    expect(output).toContain("/**\n * tag2\n */");
    expect(output).toContain("export { default as operation3 } from \"./operations/operation3\";");
  });

  it("should handle empty operations", () => {
    const operations = {};
    const output = generateInterface(operations);
    expect(output).toBe("");
  });
});
