import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";

/**
 * Resolves a parameter object from a reference or returns the parameter object itself.
 *
 * @param input - The parameter object or reference object to resolve.
 * @param components - The components object containing parameter definitions.
 * @returns The resolved parameter object.
 */
export function bringParameterFromRefs(
  input: ParameterObject | ReferenceObject,
  components: ComponentsObject,
): ParameterObject {
  if ("$ref" in input) {
    const [_, __, category, componentName] = input.$ref.split("/");
    if (!componentName || !category || category !== "parameters") {
      throw new Error("Invalid $ref");
    }
    const collection = components[category] ?? {};
    const component = collection[componentName];
    if (!component) throw new Error("Component not found");
    return bringParameterFromRefs(component, components);
  }
  return input;
}
