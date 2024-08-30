import { first } from "~/server/libs/loginIntents";

const TIMEOUT_LIMIT = 2 * 60_000; // TODO: Read from runtime config

export default async (phone: string) => {
  const timestamp = new Date(
    new Date().getTime() - TIMEOUT_LIMIT,
  );
  const password = await first({
    provider: "phone",
    context: phone,
    timestamp,
  });
  if (password) {
    throw createError({
      statusCode: 429,
      statusMessage: "Phone request limit exceeded",
    });
  }
};
