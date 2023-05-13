import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";

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
      return {
        success: true,
      };
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
