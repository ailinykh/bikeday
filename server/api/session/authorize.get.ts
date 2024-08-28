import { H3Event, getProxyRequestHeaders } from "h3";
import { createSession } from "~/server/libs/session";
import prisma from "~/server/libs/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    const { payload, redirect } = getQuery(event);
    if (!payload) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    }

    await protectCode(event);

    const password = payload.toString();
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

      const passwordLog =
        await prisma.oneTimePasswordLog.findFirst({
          where: {
            password,
            ipAddress,
            createdAt: {
              gte: timeout,
            },
          },
        });

      // Skip logging to avoid polling autoban
      if (!passwordLog) {
        await prisma.oneTimePasswordLog.create({
          data: {
            password,
            ipAddress,
            userAgent,
          },
        });
      }

      throw createError({
        statusCode: 404,
        statusMessage: "Payload not found",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        telegramId: otp.context,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    createSession(event, user);

    if (redirect === false) {
      return {
        success: true,
      };
    }

    return sendRedirect(event, "/event");
  },
);
