import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";

/**
 * Resolves a request body object from a reference or returns the input object itself.
 *
 * @param input - The request body object or reference to resolve.
 * @param components - The components object containing possible references.
 * @returns The resolved request body object.
 */
export function bringRequestBodyFromRefs(
  input: RequestBodyObject | ReferenceObject,
  components: ComponentsObject,
): RequestBodyObject {
  if ("$ref" in input) {
    const [_, __, category, componentName] = input.$ref.split("/");
    if (!componentName || !category || category !== "requestBodies") {
      throw new Error("Invalid $ref");
    }
    const collection = components[category] ?? {};
    const component = collection[componentName];
    if (!component) throw new Error("Component not found");
    return bringRequestBodyFromRefs(component, components);
  }
  return input;
}
