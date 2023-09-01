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
        message.from,
      )} with ${JSON.stringify(message.contact)}`,
    );

    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      text: "😨 Кажется, это не ваш контакт",
    };
  }

  await prisma.user.upsert({
    where: {
      phone: message.contact.phone_number,
    },
    update: {
      phone: message.contact.phone_number,
      telegramId: message.contact.user_id.toString(),
    },
    create: {
      status: "user",
      firstName: message.contact.first_name,
      lastName: message.contact.last_name,
      phone: message.contact.phone_number,
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
  const text = [
    "✅ Для завершения авторизации перейдите по ссылке:",
    "",
    `http://${host}/api/session/authorize?code=${otp.password}`,
  ];
  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: text.join("\n"),
    disable_web_page_preview: true,
    reply_markup: {
      remove_keyboard: true,
    },
  };
};
