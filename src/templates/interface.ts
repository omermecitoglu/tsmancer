import render from "~/core/template";
import template from "./interface.hbs";

type Template = {
  envName: string,
  importedSchemas: string[],
  operations: string[],
};

export function generateInterface(
  envName: string,
  importedSchemas: string[],
  operations: string[],
) {
  return render<Template>(template)({
    envName,
    importedSchemas,
    operations,
  });
}
