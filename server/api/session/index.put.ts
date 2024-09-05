import { H3Event } from "h3";
import { createSession } from "~/server/libs/session";
import prisma from "~/server/libs/prisma";
import { first } from "~/server/libs/loginIntents";
import { create } from "~/server/libs/loginAttempts";

export default defineEventHandler(
  async (event: H3Event) => {
    const headers = getProxyRequestHeaders(event);
    const userAgent = headers["user-agent"];
    const ipAddress =
      headers["x-forwarded-for"] ?? "127.0.0.1";

    await protectCode(ipAddress);

    const { code, phone } = await readBody(event);

    if (!code || !phone) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad request",
      });
    }

    // Code have to be created less than 5 minutes ago
    const timestamp = new Date(
      new Date().getTime() - 5 * 60_000,
    ); // TODO: Read from runtime config
    const password = await first({
      provider: "phone",
      context: phone,
      password: code,
      timestamp,
    });

    if (!password) {
      // Code invalid or expired
      await create({
        password: code,
        ipAddress,
        userAgent,
      });

      throw createError({
        statusCode: 403,
        statusMessage: "Code invalid or expired",
      });
    }

    // Authorization succeeded
    let user = await prisma.user.findFirst({
      where: {
        phone: password.context,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: password.context,
          status: "user",
          firstName: "",
          lastName: "",
        },
      });
    }

    createSession(event, user);

    return user;
  },
);
