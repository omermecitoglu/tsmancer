import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ResponseObject } from "@omer-x/openapi-types/response";

/**
 * Extracts the JSON schema from a given input object.
 *
 * @param input - The input object, which can be a ResponseObject or RequestBodyObject.
 * @returns The JSON schema if found, otherwise null.
 */
export function getJsonSchema(input: ResponseObject | RequestBodyObject) {
  if (!input.content) return null;
  if ("application/json" in input.content) {
    return input.content["application/json"].schema ?? null;
  }
  return null;
}
