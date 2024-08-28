import { randomUUID } from "crypto";
import { H3Event, getHeaders } from "h3";
import type { TelegramMessage } from "~/types/telegram";
import prisma from "~/server/lib/prisma";

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

  if (event.context.user) {
    // User already exists
    const host =
      headers["x-forwarded-host"] ||
      headers["x-forwarded-server"] ||
      headers["host"];
    // const port = headers["x-forwarded-port"]
    //   ? ":" + headers["x-forwarded-port"]
    //   : "";
    return {
      method: "sendMessage",
      chat_id: message.chat.id,
      text: "✅ Для завершения авторизации нажмите на кнопку:",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🌐 Перейти на сайт",
              url: `https://${host}/api/session/authorize?payload=${password}`,
            },
          ],
        ],
      },
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
