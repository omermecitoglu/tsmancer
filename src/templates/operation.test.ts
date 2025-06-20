import crypto from "node:crypto";
import { describe, expect, it, vi } from "vitest";
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
    expect(output).toContain('import type stringSchema from "../schemas/stringSchema";');
    expect(output).toContain('import { schemaOfstringSchema } from "../zod-schemas/stringSchema";');
    expect(output).toContain('import type ObjectSchema from "../schemas/ObjectSchema";');
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
    expect(output).toContain("const content = null;");
    expect(output).toContain('throw new Error(`Undocumented response from test (POST ${"/example"})`);');
  });

  it("should handle operations with query parameters", () => {
    const method = "GET";
    const pathName = "/example";
    const rawOperation: OperationObject = {
      operationId: "testQuery",
      parameters: [
        {
          name: "search",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Search query parameter",
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
      StringSchema: { type: "string" },
      ObjectSchema: { type: "object" },
    };
    const components: ComponentsObject = {};

    vi.spyOn(crypto, "randomUUID").mockReturnValueOnce("00000000-0000-0000-0000-000000000001");
    const schema1 = "Schema00000000000000000000000000000001";

    const output = generateOperation(method, pathName, rawOperation, schemaDB, components);
    expect(output).toContain(`import type ${schema1} from "../schemas/${schema1}";`);
    expect(output).toContain(`import { schemaOf${schema1} } from "../zod-schemas/${schema1}";`);
    expect(output).toContain('import type ObjectSchema from "../schemas/ObjectSchema";');
    expect(output).toContain('import { createURL } from "../utils/createURL";');
    expect(output).toContain('import { parseZodSchema } from "../utils/parseZodSchema";');
    expect(output).toContain("* @param queryParams - Query Parameters");
    expect(output).toContain("export default async function(");
    expect(output).toContain(`queryParams: ${schema1},`);
    expect(output).toContain(`const url = createURL("/example", parseZodSchema(schemaOf${schema1}, queryParams));`);
    expect(output).toContain("const response = await fetch(url, {");
    expect(output).toContain('method: "GET",');
    expect(output).toContain("headers: {");
    expect(output).toContain('"Content-Type": "application/json",');
    expect(output).toContain("switch (response.status) {");
    expect(output).toContain("case 200: {");
    expect(output).toContain("const content = await response.json() as ObjectSchema;");
    expect(output).toContain('throw new Error(`Undocumented response from testQuery (GET ${"/example"})`);');

    vi.restoreAllMocks();
  });

  it("should handle operations with requestBody", () => {
    const method = "POST";
    const pathName = "/example";
    const rawOperation: OperationObject = {
      operationId: "testRequestBody",
      requestBody: {
        description: "Request body description",
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
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
      ObjectSchema: { type: "object" },
    };
    const components: ComponentsObject = {};

    const output = generateOperation(method, pathName, rawOperation, schemaDB, components);
    expect(output).toContain('import type ObjectSchema from "../schemas/ObjectSchema";');
    expect(output).toContain('import { schemaOfObjectSchema } from "../zod-schemas/ObjectSchema";');
    expect(output).toContain('import type ObjectSchema from "../schemas/ObjectSchema";');
    expect(output).toContain('import { createURL } from "../utils/createURL";');
    expect(output).toContain('import { parseZodSchema } from "../utils/parseZodSchema";');
    expect(output).toContain("* @param requestBody - Request Body");
    expect(output).toContain("export default async function(");
    expect(output).toContain("requestBody: ObjectSchema,");
    expect(output).toContain("const url = createURL(\"/example\");");
    expect(output).toContain("const response = await fetch(url, {");
    expect(output).toContain("method: \"POST\",");
    expect(output).toContain("headers: {");
    expect(output).toContain("\"Content-Type\": \"application/json\",");
    expect(output).toContain("body: JSON.stringify(parseZodSchema(schemaOfObjectSchema, requestBody)),");
    expect(output).toContain("switch (response.status) {");
    expect(output).toContain("case 200: {");
    expect(output).toContain("const content = await response.json() as ObjectSchema;");
    expect(output).toContain('throw new Error(`Undocumented response from testRequestBody (POST ${"/example"})`);');
  });

  it("should handle operations with path parameters", () => {
    const method = "GET";
    const pathName = "/example/{id}";
    const rawOperation: OperationObject = {
      operationId: "testPathParameters",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID path parameter",
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
      StringSchema: { type: "string" },
      ObjectSchema: { type: "object" },
    };
    const components: ComponentsObject = {};

    const output = generateOperation(method, pathName, rawOperation, schemaDB, components);
    expect(output).toContain('import type StringSchema from "../schemas/StringSchema";');
    expect(output).toContain('import { schemaOfStringSchema } from "../zod-schemas/StringSchema";');
    expect(output).toContain('import type ObjectSchema from "../schemas/ObjectSchema";');
    expect(output).toContain('import { createURL } from "../utils/createURL";');
    expect(output).toContain('import { parseZodSchema } from "../utils/parseZodSchema";');
    expect(output).toContain("* @param id - ID path parameter");
    expect(output).toContain("export default async function(");
    expect(output).toContain("id: StringSchema,");
    expect(output).toContain("id = parseZodSchema(schemaOfStringSchema, id);");
    expect(output).toContain("const url = createURL(`/example/${id}`);");
    expect(output).toContain("const response = await fetch(url, {");
    expect(output).toContain('method: "GET",');
    expect(output).toContain("headers: {");
    expect(output).toContain('"Content-Type": "application/json",');
    expect(output).toContain("switch (response.status) {");
    expect(output).toContain("case 200: {");
    expect(output).toContain("const content = await response.json() as ObjectSchema;");
    expect(output).toContain("throw new Error(`Undocumented response from testPathParameters (GET ${`/example/${id}`})`);");
  });

  it("should handle operations with path parameters without description", () => {
    const method = "GET";
    const pathName = "/example/{id}";
    const rawOperation: OperationObject = {
      operationId: "test",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
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
      StringSchema: { type: "string" },
      ObjectSchema: { type: "object" },
    };
    const components: ComponentsObject = {};

    const output = generateOperation(method, pathName, rawOperation, schemaDB, components);
    expect(output).toContain('import type StringSchema from "../schemas/StringSchema";');
    expect(output).toContain('import { schemaOfStringSchema } from "../zod-schemas/StringSchema";');
    expect(output).toContain('import type ObjectSchema from "../schemas/ObjectSchema";');
    expect(output).toContain('import { createURL } from "../utils/createURL";');
    expect(output).toContain('import { parseZodSchema } from "../utils/parseZodSchema";');
    expect(output).toContain("* @param id - missing-description");
    expect(output).toContain("export default async function(");
    expect(output).toContain("id: StringSchema,");
    expect(output).toContain("id = parseZodSchema(schemaOfStringSchema, id);");
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

  it("should handle operations with path parameters, query parameters, and request body without schema", () => {
    const method = "POST";
    const pathName = "/example/{id}";
    const rawOperation: OperationObject = {
      operationId: "testNoSchema",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {},
        },
      },
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
    const schemaDB: Record<string, SchemaObject> = {};
    const components: ComponentsObject = {};

    const output = generateOperation(method, pathName, rawOperation, schemaDB, components);
    expect(output).toContain("export default async function(");
    expect(output).toContain("id: unknown,");
    expect(output).toContain("requestBody: unknown,");
    expect(output).toContain("const url = createURL(`/example/${id}`);");
    expect(output).toContain("const response = await fetch(url, {");
    expect(output).toContain("method: \"POST\",");
    expect(output).toContain("headers: {");
    expect(output).toContain("\"Content-Type\": \"application/json\",");
    expect(output).toContain("body: JSON.stringify(parseZodSchema(schemaOfunknown, requestBody)),");
    expect(output).toContain("switch (response.status) {");
    expect(output).toContain("case 200: {");
    expect(output).toContain("throw new Error(`Undocumented response from testNoSchema (POST ${`/example/${id}`})`);");
  });
});
