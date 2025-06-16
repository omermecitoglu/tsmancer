import render from "~/core/template";
import template from "./createURL.hbs";

type Template = {
  envName: string,
};

export function generateUtilForURL(envName: string) {
  return render<Template>(template)({
    envName,
  });
}
