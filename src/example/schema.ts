import { jsonSchemaToZod } from "json-schema-to-zod";
import { z } from "zod/v4";

export const schemaOfPlayerDTO = z.object({ errorCode: z.enum(["CHAPTER_NOT_FOUND", "SUBJECT_PARENT_NOT_FOUND"]), detail: z.string() });

export type PlayerDTO = z.infer<typeof schemaOfPlayerDTO>;

const bazinga = jsonSchemaToZod({
  type: "object",
  required: [
    "errorCode",
    "detail",
  ],
  properties: {
    errorCode: {
      type: "string",
      enum: [
        "CHAPTER_NOT_FOUND",
        "SUBJECT_PARENT_NOT_FOUND",
      ],
    },
    detail: {
      type: "string",
    },
  },
  example: {
    errorCode: "CHAPTER_NOT_FOUND",
    detail: "Chapter with ID '{chapterId}' not found.",
  },
});

console.log(bazinga);
