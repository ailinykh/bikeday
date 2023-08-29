import { randomUUID } from "crypto";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const uuid = randomUUID();
  const url = `tg://t.me/${config.telegram.botUsername}?start=${uuid}`;
  return {
    url,
  };
});
