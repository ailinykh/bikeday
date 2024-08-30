import { H3Event } from "h3";
import { sendSms } from "~/server/libs/sms";
import protectPhone from "~/server/utils/protectPhone";
import prisma from "~/server/libs/prisma";
import { create } from "~/server/libs/loginIntents";

export default defineEventHandler(
  async (event: H3Event) => {
    await protectIpAddress(event);

    const body = await readBody(event);

    if (!body.phone) {
      throw createError({
        statusCode: 400,
        statusMessage: "Phone not specified",
      });
    }

    const phone = body.phone.replace(/\D+/g, "");

    if (phone.length != 11) {
      throw createError({
        statusCode: 400,
        statusMessage: "Insufficient digits",
      });
    }

    if (!phone.startsWith("79")) {
      throw createError({
        statusCode: 400,
        statusMessage: "Unexpected phone format",
      });
    }

    await protectPhone(phone);

    const headers = getProxyRequestHeaders(event);
    const userAgent = headers["user-agent"].slice(191);
    const ipAddress = headers["x-forwarded-for"];
    const password = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    console.info(
      `creating login code ${password} for ${phone} ip: ${ipAddress}`,
    );

    const { context, provider, createdAt } = await create({
      context: phone,
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

    await sendSms({ phone, text });

    return { context, provider, createdAt };
  },
);
