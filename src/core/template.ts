import Handlebars from "handlebars";

/**
 * Compiles a Handlebars template from the given input string.
 *
 * @param input - A raw string of a Handlebars (.hbs) file.
 * @returns A compiled Handlebars template function.
 */
export default function getTemplate<T>(input: string) {
  return Handlebars.compile<T>(input);
}
