import { randomUUID } from "crypto";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const uuid = randomUUID();
  const url = `tg://resolve?domain=${config.telegram.botUsername}&start=${uuid}`;
  return {
    url,
  };
});
