import { describe, expect, it } from "vitest";
import { generateOperation } from "./operation";
import type { ComponentsObject } from "@omer-x/openapi-types/components";
import type { OperationObject } from "@omer-x/openapi-types/operation";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("generateOperation", () => {
  it("should generate operation with correct template", () => {
    const method = "GET";
    const pathName = "/example/{id}";
    const rawOperation: OperationObject = {
      deprecated: true,
      operationId: "test",
      summary: "Example summary",
      description: "Example description",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID parameter",
        },
      ],
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
      },
    };
    const schemaDB: Record<string, SchemaObject> = {
      stringSchema: { type: "string" },
      ObjectSchema: { type: "object" },
    };
    const components: ComponentsObject = {};

    const output = generateOperation(method, pathName, rawOperation, schemaDB, components);
    expect(output).toContain('import { schemaOfstringSchema, type stringSchema } from "../schemas/stringSchema";');
    expect(output).toContain('import { type ObjectSchema } from "../schemas/ObjectSchema";');
    expect(output).toContain('import { createURL } from "../utils/createURL";');
    expect(output).toContain('import { parseZodSchema } from "../utils/parseZodSchema";');
    expect(output).toContain("* @deprecated This operation is deprecated.");
    expect(output).toContain("* Example summary");
    expect(output).toContain("* Example description");
    expect(output).toContain("* @param id - ID parameter");
    expect(output).toContain("export default async function(");
    expect(output).toContain("id: stringSchema,");
    expect(output).toContain("id = parseZodSchema(schemaOfstringSchema, id);");
    expect(output).toContain("const url = createURL(`/example/${id}`);");
    expect(output).toContain("const response = await fetch(url, {");
    expect(output).toContain('method: "GET",');
    expect(output).toContain("headers: {");
    expect(output).toContain('"Content-Type": "application/json",');
    expect(output).toContain("switch (response.status) {");
    expect(output).toContain("case 200: {");
    expect(output).toContain("const content = await response.json() as ObjectSchema;");
    expect(output).toContain("throw new Error(`Undocumented response from test (GET ${`/example/${id}`})`);");
  });

  it("should handle operations without parameters", () => {
    const method = "POST";
    const pathName = "/example";
    const rawOperation: OperationObject = {
      operationId: "test",
      responses: {
        201: {
          description: "Created",
        },
      },
    };
    const schemaDB: Record<string, SchemaObject> = {};
    const components: ComponentsObject = {};

    const output = generateOperation(method, pathName, rawOperation, schemaDB, components);
    expect(output).toContain('import { createURL } from "../utils/createURL";');
    expect(output).toContain('import { parseZodSchema } from "../utils/parseZodSchema";');
    expect(output).toContain("export default async function(");
    expect(output).toContain('const url = createURL("/example");');
    expect(output).toContain("const response = await fetch(url, {");
    expect(output).toContain('method: "POST",');
    expect(output).toContain("headers: {");
    expect(output).toContain('"Content-Type": "application/json",');
    expect(output).toContain("switch (response.status) {");
    expect(output).toContain("case 201: {");
    expect(output).toContain("const content = await response.json() as unknown;");
    expect(output).toContain('throw new Error(`Undocumented response from test (POST ${"/example"})`);');
  });
});
