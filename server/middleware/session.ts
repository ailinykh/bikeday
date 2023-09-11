import jwt from "jsonwebtoken";
import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { TelegramUpdate } from "~/types/telegram";
import { protectRequest } from "~/server/lib/telegram";

const prisma = new PrismaClient();
const config = useRuntimeConfig();

const handleTelegram = async (event: H3Event) => {
  protectRequest(event);
  const update = await readBody<TelegramUpdate>(event);
  const from =
    update.message?.from || update.callback_query?.from; //TODO: more cases?
  if (from) {
    event.context.user = await prisma.user.findUnique({
      where: { telegramId: from.id.toString() },
    });
  }

  event.context.telegram = {
    update,
  };
};

const handleCookies = (event: H3Event) => {
  const cookie = getCookie(event, "__session");

  if (cookie) {
    try {
      const user = jwt.verify(cookie, config.tokenSecret);

      if (!user) {
        return;
      }

      event.context.user = user;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        console.info("❌ token expired");
      } else {
        console.error(err);
      }
    }
  }
};

export default defineEventHandler(
  async (event: H3Event) => {
    if (event.path.startsWith("/api/telegram/webhook")) {
      await handleTelegram(event);
    } else {
      handleCookies(event);
    }
  },
);
