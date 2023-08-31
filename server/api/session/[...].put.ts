import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";
import { createSession } from "~/server/lib/session";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: H3Event) => {
    await protectCode(event);

    const body = await readBody(event);

    if (!body.code || !body.phone) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad request",
      });
    }

    // Code have to be created less than 5 minutes ago
    const { code, phone } = body;
    const now = new Date().getTime();
    const timeout = new Date(now - 5 * 60_000);
    const password = await prisma.oneTimePassword.findFirst(
      {
        where: {
          provider: "phone",
          context: phone,
          password: code,
          createdAt: {
            gte: timeout,
          },
        },
      }
    );

    // Authorization succeeded
    if (password) {
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
    }

    // Code invalid or expired
    const headers = getProxyRequestHeaders(event);
    const userAgent = headers["user-agent"];
    const ipAddress = headers["x-forwarded-for"];

    await prisma.oneTimePasswordLog.create({
      data: {
        password: code,
        ipAddress,
        userAgent,
      },
    });

    throw createError({
      statusCode: 403,
      statusMessage: "Code invalid or expired",
    });
  }
);
