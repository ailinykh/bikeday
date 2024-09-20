import { H3Event } from "h3";
import type { User } from "~~/types";

export default (
  event: H3Event,
  acl: string[] = ["user", "volunteer", "admin"],
) => {
  const user: User = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  if (!acl.includes(user.status)) {
    console.warn(
      `unauthorized access: ${event.path}`,
      user,
    );
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }
};
