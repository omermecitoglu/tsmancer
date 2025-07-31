import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { generateJsrJon } from "./jsr";

describe("generateJsrJon", () => {
  const mockPackageJson = {
    name: "test-package",
    version: "2.3.4",
  };

  it("should read package.json and generate correct jsr.json string", () => {
    const filePath = path.resolve(process.cwd(), "package.json");
    const spy = vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(mockPackageJson));

    const result = generateJsrJon();
    const parsed = JSON.parse(result);

    expect(spy).toHaveBeenCalledWith(filePath, "utf-8");
    expect(parsed.name).toBe(mockPackageJson.name);
    expect(parsed.version).toBe(mockPackageJson.version);
    expect(parsed.license).toBe("MIT");
    expect(parsed.exports).toBe("./src/index.ts");
    expect(parsed.publish.include).toContain("LICENSE");
    expect(parsed.publish.include).toContain("README.md");
    expect(parsed.publish.include).toContain("src/**/*.ts");

    spy.mockRestore();
  });

  it("should default version to 1.0.0 if not present", () => {
    const mockContent = JSON.stringify({ name: "no-version" });
    const spy = vi.spyOn(fs, "readFileSync").mockReturnValue(mockContent);

    const result = generateJsrJon();
    const parsed = JSON.parse(result);

    expect(parsed.version).toBe("1.0.0");
    spy.mockRestore();
  });
});
