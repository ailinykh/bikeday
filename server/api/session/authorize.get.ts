import { H3Event, getProxyRequestHeaders } from "h3";
import { createSession } from "~~/server/libs/session";
import prisma from "~~/server/libs/prisma";
import { first as firstIntent } from "~~/server/libs/loginIntents";
import {
  create,
  first as firstAttempt,
} from "~~/server/libs/loginAttempts";

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
    const timestamp = new Date(
      new Date().getTime() - 5 * 60_000, // TODO: Read from runtime config
    );
    const otp = await firstIntent({
      password,
      timestamp,
    });

    if (!otp) {
      const headers = getProxyRequestHeaders(event);
      const userAgent = headers["user-agent"];
      const ipAddress = headers["x-forwarded-for"];

      const attempt = await firstAttempt({
        password,
        ipAddress,
        timestamp,
      });

      // Skip logging to avoid telegram polling autoban
      if (!attempt) {
        await create({
          password,
          ipAddress,
          userAgent,
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
