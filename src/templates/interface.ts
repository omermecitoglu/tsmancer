import render from "~/core/template";
import template from "./interface.hbs";

type Template = {
  operations: { tags: string, operationIds: string[] }[],
};

export function generateInterface(operations: Record<string, string[]>) {
  return render<Template>(template)({
    operations: Object.entries(operations).map(([tags, operationIds]) => ({ tags, operationIds })),
  });
}
