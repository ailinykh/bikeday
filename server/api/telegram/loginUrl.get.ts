import { randomUUID } from "crypto";

const username = process.env.TELEGRAM_BOT_USERNAME;

export default defineEventHandler(async (event) => {
  const uuid = randomUUID();
  const url = `tg://t.me/${username}?start=${uuid}`;
  return {
    url,
  };
});
