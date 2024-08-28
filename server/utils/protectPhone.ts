import prisma from "~/server/libs/prisma";

const TIMEOUT_LIMIT = 2 * 60_000;

export default async (phone: string) => {
  const now = new Date().getTime();
  const timeout = new Date(now - TIMEOUT_LIMIT);
  const password = await prisma.oneTimePassword.findFirst({
    where: {
      provider: "phone",
      context: phone,
      createdAt: {
        gte: timeout,
      },
    },
  });
  if (password) {
    const seconds = Math.floor(
      Math.abs(
        password.createdAt.getTime() - timeout.getTime(),
      ) / 1000,
    );
    throw createError({
      statusCode: 429,
      statusMessage: "Phone request limit exceeded",
      cause: seconds,
    });
  }
};
