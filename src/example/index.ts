import { type PlayerDTO, schemaOfPlayerDTO } from "./schema";
import type { ZodType, z } from "zod/v4";

export async function readAnnouncement(announcementId: number) {
  const response = await fetch(`/api/announcements/${announcementId}`);
  switch (response.status) {
    case 200:
      return {
        success: response.ok,
        content: { id: 5, title: "xxx", content: "yyy" },
      };
    case 404: {
      const content = await response.json() as { errorCode: "USER_NOT_FOUND", detail: string };
      return {
        success: response.ok,
        content,
      };
    }
    default: {
      const content = null;
      return {
        success: response.ok,
        content,
      };
    }
  }
}

function createURL(endPoint: string, queryParams: Record<string, unknown> = {}) {
  if (!process.env.API_BASE_URL) {
    throw new Error("Base URL is not defined for this service! Please add API_BASE_URL to the environment variables.");
  }
  const url = new URL(endPoint, process.env.API_BASE_URL);
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) continue;
    if (typeof value === "string") {
      url.searchParams.append(key, value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, item);
      }
    } else {
      url.searchParams.append(key, JSON.stringify(value));
    }
  }
  return url;
}

function parseZodSchema<T extends ZodType>(schema: T, data: z.infer<T>) {
  const result = schema.safeParse(data);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * @deprecated This operation is deprecated.
 * Get a user by ID.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The sum of a and b.
 */
export async function updateAnnouncement(announcementId: number, queryParams: unknown, data: PlayerDTO) {
  const anan = parseZodSchema(schemaOfPlayerDTO, data);
  const result = schemaOfPlayerDTO.safeParse(data);
  if (!result.success) {
    console.log(result.error); // handle this zod error
    throw result.error;
  }
  const url = createURL(`/xxxxxx/${1111}}`);
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result.data),
  });
  switch (response.status) {
    case 200:
      return {
        success: response.ok,
        content: { id: 5, title: "xxx", content: "yyy" },
      };
    case 403: {
      const content = null;
      return {
        success: response.ok,
        content,
      };
    }
    case 404: {
      const content = await response.json() as { errorCode: "USER_NOT_FOUND", detail: string };
      return {
        success: response.ok,
        content,
      };
    }
    case 409: {
      const content = await response.json() as { errorCode: "USERNAME_TAKEN" | "EMAIL_ALREADY_USED", detail: string };
      return {
        success: response.ok,
        content,
      };
    }
    case 422: {
      const content = await response.json() as { errorCode: "WHATEVER", detail: string };
      return {
        success: response.ok,
        content,
      };
    }
    default: {
      const content = null;
      return {
        success: response.ok,
        content,
      };
    }
  }
}
