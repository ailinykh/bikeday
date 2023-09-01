import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";
import { H3Event, getHeaders } from "h3";
import { TelegramMessage } from "~/types/telegram";

const prisma = new PrismaClient();

export const handleStart = async (
  message: TelegramMessage,
  event: H3Event,
) => {
  const password =
    message.text?.split(" ")[1] || randomUUID();
  const headers = getHeaders(event);
  await prisma.oneTimePassword.create({
    data: {
      context: message.from.id.toString(),
      password,
      provider: "telegram",
      ipAddress: headers["x-forwarded-for"] || "",
      userAgent: "",
    },
  });

  const user = await prisma.user.findFirst({
    where: {
      telegramId: message.from.id.toString(),
    },
  });

  if (user) {
    // User already exists
    const host =
      headers["x-forwarded-host"] ||
      headers["x-forwarded-server"] ||
      headers["host"];
    // const port = headers["x-forwarded-port"]
    //   ? ":" + headers["x-forwarded-port"]
    //   : "";
    const text = [
      "✅ Для завершения авторизации перейдите по ссылке:",
      "",
      `http://${host}/api/session/authorize?code=${password}`,
    ];
    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      text: text.join("\n"),
      disable_web_page_preview: true,
    };
  }

  const text = [
    "👋🏻 Добро пожаловать на <b>Велодень</b>!",
    "",
    'Для продолжения нажмите кнопку "🔑 Войти по номеру телефона" ниже 👇🏻',
  ];
  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: text.join("\n"),
    parse_mode: "HTML",
    reply_markup: {
      keyboard: [
        [
          {
            text: "🔑 Войти по номеру телефона",
            request_contact: true,
          },
        ],
      ],
      one_time_keyboard: true,
    },
  };
};
