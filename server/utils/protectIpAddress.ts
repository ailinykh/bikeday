import { count } from "~/server/libs/loginIntents";

const TIMEOUT_LIMIT = 5 * 60_000;
const REQUEST_LIMIT = 10;

export default async (ipAddress: string) => {
  const attempts = await count({
    ipAddress,
    timestamp: new Date(
      new Date().getTime() - TIMEOUT_LIMIT,
    ),
  });
  if (attempts >= REQUEST_LIMIT) {
    console.warn(`Too Many Requests for ${ipAddress}`);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
    });
  }
};
