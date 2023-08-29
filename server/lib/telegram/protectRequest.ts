import { H3Event, getHeaders } from "h3";

const config = useRuntimeConfig();

export const protectRequest = (event: H3Event) => {
  const headers = getHeaders(event);
  if (
    headers["x-telegram-bot-api-secret-token"] !=
    config.telegram.botSecret
  ) {
    console.log("Bad x-telegram-bot-api-secret-token");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }
};
