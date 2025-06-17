import fs from "node:fs/promises";
import path from "node:path";
import type { OpenApiDocument } from "@omer-x/openapi-types";

/**
 * Fetches an OpenAPI specification from a given source.
 *
 * @param source - The source of the OpenAPI specification. Can be a URL or a file path.
 * @returns The parsed OpenAPI document, or null if the file does not exist.
 */
export async function fetchOpenApiSpec(source: string) {
  if (source.startsWith("http://") || source.startsWith("https://")) {
    const response = await fetch(source);
    return (await response.json()) as OpenApiDocument;
  } else {
    try {
      const absolutePath = path.resolve(source);
      const fileContent = await fs.readFile(absolutePath, "utf-8");
      return JSON.parse(fileContent) as OpenApiDocument;
    } catch (error) {
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        if (error.message.startsWith("ENOENT: no such file or directory")) {
          // eslint-disable-next-line no-console
          console.log(error.message);
          return null;
        }
      }
      throw error;
    }
  }
}
