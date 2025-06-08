import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ResponseObject } from "@omer-x/openapi-types/response";

export function getJsonSchema(input: ResponseObject | RequestBodyObject) {
  if (!input.content) return null;
  if ("application/json" in input.content) {
    return input.content["application/json"].schema ?? null;
  }
  return null;
}
