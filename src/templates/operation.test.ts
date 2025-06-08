import crypto from "node:crypto";
import { describe, expect, it, jest } from "@jest/globals";
import { removeIndentations } from "~/utils/removeIndentations";
import { generateOperation } from "./operation";
import type { OperationObject } from "@omer-x/openapi-types/operation";

describe("generateOperation", () => {
  it("should XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", () => {
    const operation: OperationObject = {
      tags: [
        "Announcements",
      ],
      summary: "Get Single Announcement",
      description: "Retrieves an announcement by its ID.",
      operationId: "getAnnouncementById",
      parameters: [
        {
          name: "announcementId",
          in: "path",
          required: true,
          schema: {
            type: "integer",
            description: "The ID of the announcement",
          },
          description: "The ID of the announcement",
        },
      ],
      responses: {
        200: {
          description: "The requested announcement.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AnnouncementDTO",
              },
            },
          },
        },
        404: {
          description: "Announcement not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "errorCode",
                  "detail",
                ],
                properties: {
                  errorCode: {
                    type: "string",
                    enum: [
                      "ANNOUNCEMENT_NOT_FOUND",
                    ],
                  },
                  detail: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        422: {
          description: "Validation Error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HTTPValidationError",
              },
            },
          },
        },
      },
    };

    let schemaNumber = 0;

    const spy = jest.spyOn(crypto, "randomUUID").mockImplementation(() => {
      schemaNumber++;
      return `00000000-0000-0000-0000-00000000000${schemaNumber}`;
    });

    const output = generateOperation("GET", "/announcements/{announcementId}", operation);
    const expectedOutput = `
      /**
       * Get Single Announcement
       * 
       * Retrieves an announcement by its ID.
       * 
       * @param announcementId - The ID of the announcement
       */
      export async function getAnnouncementById(
        announcementId: Schema00000000000000000000000000000001,
      ) {
        const url = createURL(\`/announcements/\${announcementId}\`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        switch (response.status) {
          case 200: {
            const content = await response.json() as Schema00000000000000000000000000000002;
            return {
              success: response.ok,
              content,
            };
          }
          case 404: {
            const content = await response.json() as Schema00000000000000000000000000000003;
            return {
              success: response.ok,
              content,
            };
          }
          case 422: {
            const content = await response.json() as Schema00000000000000000000000000000004;
            return {
              success: response.ok,
              content,
            };
          }
          default: {
            return {
              success: response.ok,
              content: null,
            };
          }
        }
      }
    `;
    expect(output).toBe(removeIndentations(expectedOutput, 3, 2) + "\n");
    spy.mockRestore();
  });
});
