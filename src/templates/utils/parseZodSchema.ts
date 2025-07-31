import render from "~/core/template";
import template from "./parseZodSchema.hbs";

type Template = {
  zodSource: string,
};

export function generateUtilForZod(registry: string) {
  return render<Template>(template)({
    zodSource: registry === "jsr" ? "npm:zod@4" : "zod",
  });
}
