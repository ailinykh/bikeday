import { PrismaClient } from "@prisma/client";
import { H3Event, getProxyRequestHeaders } from "h3";
import { createSession } from "~/server/lib/session";

const prisma = new PrismaClient();
const { tokenSecret } = useRuntimeConfig();

export default defineEventHandler(
  async (event: H3Event) => {
    const { code } = getQuery(event);
    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    }
    const password = code.toString();
    const now = new Date().getTime();
    const timeout = new Date(now - 5 * 60_000);
    const otp = await prisma.oneTimePassword.findFirst({
      where: {
        password,
        createdAt: {
          gte: timeout,
        },
      },
    });

    if (!otp) {
      const headers = getProxyRequestHeaders(event);
      const userAgent = headers["user-agent"];
      const ipAddress = headers["x-forwarded-for"];

      await prisma.oneTimePasswordLog.create({
        data: {
          password,
          ipAddress,
          userAgent,
        },
      });

      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        telegramId: Number(otp.context),
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    createSession(event, user);

    return sendRedirect(event, "/event");
  }
);
