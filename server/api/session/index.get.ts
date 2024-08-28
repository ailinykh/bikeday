import { H3Event } from "h3";

export default defineEventHandler((event: H3Event) => {
  const { user } = event.context;
  if (user) {
    return user;
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
});
