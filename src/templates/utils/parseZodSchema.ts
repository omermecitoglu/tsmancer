import render from "~/core/template";
import template from "./parseZodSchema.hbs";

type Template = unknown;

export function generateUtilForZod() {
  return render<Template>(template)({
  });
}
