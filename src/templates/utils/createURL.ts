import render from "~/core/template";
import template from "./createURL.hbs?raw";

type Template = {
  envName: string,
};

export function generateUtilForURL(envName: string) {
  return render<Template>(template)({
    envName,
  });
}
