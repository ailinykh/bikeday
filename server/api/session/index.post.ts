import { H3Event } from "h3";
import { CompositeMessagePublisher } from "~/server/libs/sms/composite";
import protectPhone from "~/server/utils/protectPhone";
import prisma from "~/server/libs/prisma";
import { create } from "~/server/libs/loginIntents";

const messagePublisher = new CompositeMessagePublisher();

export default defineEventHandler(
  async (event: H3Event) => {
    await protectIpAddress(event);

    const { phone } = await readBody(event);

    if (!phone) {
      throw createError({
        statusCode: 400,
        statusMessage: "Phone not specified",
      });
    }

    const normalized = phone.replace(/\D+/g, "");

    if (normalized.length != 11) {
      throw createError({
        statusCode: 400,
        statusMessage: "Insufficient digits",
      });
    }

    if (!normalized.startsWith("79")) {
      throw createError({
        statusCode: 400,
        statusMessage: "Unexpected phone format",
      });
    }

    await protectPhone(normalized);

    const headers = getProxyRequestHeaders(event);

    const userAgent = headers["user-agent"].slice(191);
    const ipAddress =
      headers["x-forwarded-for"] ?? "127.0.0.1";
    const password = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    console.info(
      `creating login code ${password} for ${normalized} ip: ${ipAddress}`,
    );

    const { context, provider, createdAt } = await create({
      context: normalized,
      password,
      provider: "phone",
      ipAddress,
      userAgent,
    });

    const bikeday = await prisma.event.findFirst({
      orderBy: { date: "desc" },
    });

    if (!bikeday) {
      throw createError({
        statusCode: 500,
        statusMessage: "Current event not found",
      });
    }

    const text = [
      `${password} - код подтверждения для входа.`,
      bikeday.title,
    ].join("\n");

    await messagePublisher.sendSms({ phone, text });

    return { context, provider, createdAt };
  },
);
