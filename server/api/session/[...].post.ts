import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";
import { sendSmsc } from "../../lib/smsCenter";
import { sendSmsAero } from "../../lib/smsAero";
import protectPhone from "../../utils/protectPhone";

const prisma = new PrismaClient();

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
    const userAgent = headers["user-agent"];
    const ipAddress = headers["x-forwarded-for"];
    const password = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    console.info(
      `creating login code ${password} for ${phone} ip: ${ipAddress}`,
    );

    const { context, provider, createdAt } =
      await prisma.oneTimePassword.create({
        data: {
          context: phone,
          password,
          provider: "phone",
          ipAddress,
          userAgent,
        },
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

    const { error } = await sendSmsc({ phone, text });
    if (error) {
      if (error == "message is denied") {
        await sendSmsAero({ phone, text });
      } else {
        // sendMessage(error);
        throw createError({
          statusCode: 500,
          statusMessage: error,
        });
      }
    }

    return { context, provider, createdAt };
  },
);
