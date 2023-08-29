import { H3Event } from "h3";

export default defineEventHandler((event: H3Event) => {
  const { user } = event.context;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  return user;
});
