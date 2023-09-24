import { randomUUID } from "crypto";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const payload = randomUUID();
  const url = `tg://resolve?domain=${config.public.telegram.botUsername}&start=${payload}`;
  return {
    url,
    payload,
  };
});
