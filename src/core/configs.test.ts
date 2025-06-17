import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import generateConfigs from "./configs";

describe("generateConfigs", () => {
  const mockFsReadFileSync = vi.spyOn(fs, "readFileSync");
  const mockPathResolve = vi.spyOn(path, "resolve");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate a configuration object with filtered dependencies", () => {
    const mockPackageJson = {
      dependencies: {
        dep1: "1.0.0",
        dep2: "2.0.0",
      },
      devDependencies: {
        devDep1: "1.0.0",
        devDep2: "2.0.0",
      },
      optionalDependencies: {
        optDep1: "1.0.0",
        optDep2: "2.0.0",
      },
    };

    mockFsReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockPathResolve.mockReturnValue("/mocked/path/package.json");

    const outputFolder = "dist";
    const dependencies = ["dep1", "devDep1", "optDep1"];

    const result = generateConfigs(outputFolder, dependencies);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.files).toEqual(["dist/"]);
    expect(parsedResult.exports["."].import).toBe("./dist/index.js");
    expect(parsedResult.exports["."].types).toBe("./dist/index.d.ts");
    expect(parsedResult.dependencies).toEqual({ dep1: "1.0.0" });
    expect(parsedResult.devDependencies).toEqual({ devDep1: "1.0.0" });
    expect(parsedResult.optionalDependencies).toEqual({ optDep1: "1.0.0" });
  });

  it("should return an empty configuration object if package.json is empty", () => {
    mockFsReadFileSync.mockReturnValue(JSON.stringify({}));
    mockPathResolve.mockReturnValue("/mocked/path/package.json");

    const outputFolder = "dist";
    const dependencies = ["dep1", "devDep1", "optDep1"];

    const result = generateConfigs(outputFolder, dependencies);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.dependencies).toBeUndefined();
    expect(parsedResult.devDependencies).toBeUndefined();
    expect(parsedResult.optionalDependencies).toBeUndefined();
  });

  it("should handle undefined dependencies gracefully", () => {
    const mockPackageJson = {};

    mockFsReadFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockPathResolve.mockReturnValue("/mocked/path/package.json");

    const outputFolder = "dist";
    const dependencies = ["dep1", "devDep1", "optDep1"];

    const result = generateConfigs(outputFolder, dependencies);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.dependencies).toBeUndefined();
    expect(parsedResult.devDependencies).toBeUndefined();
    expect(parsedResult.optionalDependencies).toBeUndefined();
  });
});
