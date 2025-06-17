import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fetchOpenApiSpec } from "./fetchOpenApiSpec";

describe("fetchOpenApiSpec", () => {
  it("should fetch and parse OpenAPI spec from a URL", async () => {
    const mockResponse = { openapi: "3.0.0", info: { title: "Test API", version: "1.0.0" } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    }));

    const result = await fetchOpenApiSpec("https://example.com/openapi.json");
    expect(result).toEqual(mockResponse);
  });

  it("should read and parse OpenAPI spec from a file", async () => {
    const mockFileContent = JSON.stringify({ openapi: "3.0.0", info: { title: "Test API", version: "1.0.0" } });
    const mockPath = path.resolve("./test-openapi.json");

    vi.spyOn(fs, "readFile").mockResolvedValue(mockFileContent);

    const result = await fetchOpenApiSpec(mockPath);
    expect(result).toEqual(JSON.parse(mockFileContent));
  });

  it("should return null if file does not exist", async () => {
    const mockPath = path.resolve("./nonexistent-file.json");

    vi.spyOn(fs, "readFile").mockRejectedValue(new Error("ENOENT: no such file or directory"));

    const result = await fetchOpenApiSpec(mockPath);
    expect(result).toBeNull();
  });

  it("should throw an error for invalid JSON in file", async () => {
    const mockPath = path.resolve("./invalid-json.json");

    vi.spyOn(fs, "readFile").mockResolvedValue("invalid-json-content");

    await expect(fetchOpenApiSpec(mockPath)).rejects.toThrow();
  });

  it("should throw an error for network issues", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    await expect(fetchOpenApiSpec("https://example.com/openapi.json")).rejects.toThrow("Network error");
  });
});
