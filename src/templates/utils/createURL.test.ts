import { describe, expect, it } from "vitest";
import { generateUtilForURL } from "./createURL";

describe("generateUtilForURL", () => {
  it("should generate a URL utility function with the correct environment variable name", () => {
    const envName = "TEST_ENV";
    const result = generateUtilForURL(envName);

    expect(result).toContain("process.env.TEST_ENV");
    expect(result).toContain("Base URL is not defined for this service! Please add TEST_ENV to the environment variables.");
  });

  it("should throw an error if the environment variable is missing", () => {
    const envName = "MISSING_ENV";
    const result = generateUtilForURL(envName);

    expect(result).toContain("process.env.MISSING_ENV");
    expect(result).toContain("Base URL is not defined for this service! Please add MISSING_ENV to the environment variables.");
  });

  it("should handle query parameters correctly", () => {
    const envName = "QUERY_ENV";
    const result = generateUtilForURL(envName);

    expect(result).toContain("url.searchParams.append");
    expect(result).toContain("Array.isArray(value)");
    expect(result).toContain("JSON.stringify(value)");
  });
});
