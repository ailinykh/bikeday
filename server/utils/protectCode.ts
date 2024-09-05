import { count } from "~/server/libs/loginAttempts";

const TIMEOUT_LIMIT = 5 * 60_000;
const REQUEST_LIMIT = 15;

export default async (ipAddress: string) => {
  const timestamp = new Date(
    new Date().getTime() - TIMEOUT_LIMIT,
  );
  const attempts = await count({ ipAddress, timestamp });
  if (attempts >= REQUEST_LIMIT) {
    console.warn(`Too Many Requests for ${ipAddress}`);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
    });
  }
};
