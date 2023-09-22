import { PrismaClient } from "@prisma/client";
import { H3Event, getHeaders } from "h3";
import { TelegramMessage } from "~/types/telegram";

const prisma = new PrismaClient();

export const handleContact = async (
  message: TelegramMessage,
  event: H3Event,
) => {
  if (!message.contact) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }

  if (message.contact.user_id != message.from.id) {
    console.info(
      `❗️ Authorization mismatch for ${JSON.stringify(
        message,
      )}`,
    );

    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      text: "😨 Кажется, это не ваш контакт",
    };
  }

  const phone = message.contact.phone_number.replace(
    /\D/,
    "",
  );

  await prisma.user.upsert({
    where: {
      phone,
    },
    update: {
      phone,
      telegramId: message.contact.user_id.toString(),
    },
    create: {
      status: "user",
      firstName: message.contact.first_name,
      lastName: message.contact.last_name ?? "",
      phone,
      telegramId: message.contact.user_id.toString(),
    },
  });

  const now = new Date().getTime();
  const timeout = new Date(now - 5 * 60_000);
  const otp = await prisma.oneTimePassword.findFirst({
    where: {
      provider: "telegram",
      context: message.from.id.toString(),
      createdAt: {
        gte: timeout,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp || otp.password.length == 0) {
    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      text: "✅ Авторизация пройдена успешно!",
      reply_markup: {
        remove_keyboard: true,
      },
    };
  }

  // User came from website, need to redirect
  const headers = getHeaders(event);
  const host =
    headers["x-forwarded-host"] ||
    headers["x-forwarded-server"] ||
    headers["host"];

  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: "✅ Для завершения авторизации нажмите на кнопку:",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🌐 Перейти на сайт",
            url: `https://${host}/api/session/authorize?payload=${otp.password}`,
          },
        ],
      ],
    },
  };
};
