import { H3Event, getHeaders } from "h3";

const secret = process.env.TELEGRAM_BOT_SECRET;

export const protectRequest = (event: H3Event) => {
  const headers = getHeaders(event);
  if (
    headers["x-telegram-bot-api-secret-token"] != secret
  ) {
    console.log("Bad x-telegram-bot-api-secret-token");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }
};
