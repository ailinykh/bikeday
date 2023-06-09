import { PrismaClient } from "@prisma/client";
import { H3Event, getProxyRequestHeaders } from "h3";

const prisma = new PrismaClient();

const TIMEOUT_LIMIT = 5 * 60_000;
const REQUEST_LIMIT = 15;

export default async (event: H3Event) => {
  const headers = getProxyRequestHeaders(event);
  // const userAgent = headers["user-agent"];
  const ipAddress = headers["x-forwarded-for"];

  const now = new Date();
  const count = await prisma.oneTimePassword.count({
    where: {
      ipAddress,
      createdAt: {
        gte: new Date(now.getTime() - TIMEOUT_LIMIT),
      },
    },
  });
  if (count > REQUEST_LIMIT) {
    console.log(`Too Many Requests for ${ipAddress}`);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
    });
  }
};
