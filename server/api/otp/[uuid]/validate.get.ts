import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { H3Event, getProxyRequestHeaders } from "h3";

const prisma = new PrismaClient();
const { tokenSecret } = useRuntimeConfig();

export default defineEventHandler(
  async (event: H3Event) => {
    const password = event.context.params!.uuid;
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

    if (tokenSecret.length == 0) {
      console.error("❌ secret token is empty");
    }

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
      },
      tokenSecret,

      {
        expiresIn: 3600,
      }
    );
    setCookie(event, "__session", token);

    return sendRedirect(event, "/event");
  }
);
