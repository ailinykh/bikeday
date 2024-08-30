import { H3Event, getProxyRequestHeaders } from "h3";
import { count } from "~/server/libs/loginIntents";

const TIMEOUT_LIMIT = 5 * 60_000;
const REQUEST_LIMIT = 15;

export default async (event: H3Event) => {
  const headers = getProxyRequestHeaders(event);
  // const userAgent = headers["user-agent"];
  const ipAddress = headers["x-forwarded-for"];

  const now = new Date();
  const attempts = await count({
    ipAddress,
    timestamp: new Date(now.getTime() - TIMEOUT_LIMIT),
  });
  if (attempts > REQUEST_LIMIT) {
    console.warn(`Too Many Requests for ${ipAddress}`);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
    });
  }
};
