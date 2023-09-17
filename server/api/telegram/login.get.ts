import { randomUUID } from "crypto";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const payload = randomUUID();
  const url = `tg://resolve?domain=${config.telegram.botUsername}&start=${payload}`;
  return {
    url,
    payload,
  };
});
