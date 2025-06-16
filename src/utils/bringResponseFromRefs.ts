import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { ResponseObject } from "@omer-x/openapi-types/response";

/**
 * Resolves a response object from a reference or returns the input response object.
 *
 * @param input - The response object or reference to resolve.
 * @param components - The components object containing references.
 * @returns The resolved response object.
 */
export function bringResponseFromRefs(
  input: ResponseObject | ReferenceObject,
  components: ComponentsObject,
): ResponseObject {
  if ("$ref" in input) {
    const [_, __, category, componentName] = input.$ref.split("/");
    if (!componentName || !category || category !== "responses") {
      throw new Error("Invalid $ref");
    }
    const collection = components[category] ?? {};
    const component = collection[componentName];
    if (!component) throw new Error("Component not found");
    return bringResponseFromRefs(component, components);
  }
  return input;
}
