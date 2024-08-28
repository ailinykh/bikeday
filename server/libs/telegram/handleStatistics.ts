import { H3Event } from "h3";
import type { TelegramMessage } from "~/types/telegram";
import prisma from "~/server/libs/prisma";

export const handleStatistics = async (
  message: TelegramMessage,
  event: H3Event,
) => {
  const errorMessage = {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: "😢 Кажется, что-то пошло не так",
    reply_markup: {
      remove_keyboard: true,
    },
  };
  if (!event.context.user) {
    return errorMessage;
  }

  const bikeday = await prisma.event.findFirst({
    orderBy: { date: "desc" },
    select: {
      title: true,
      EventParticipation: true,
    },
  });

  if (!bikeday) {
    return errorMessage;
  }

  let districts = new Map<string, number>();
  for (const p of bikeday.EventParticipation) {
    districts.set(
      p.district,
      (districts.get(p.district) ?? 0) + 1,
    );
  }

  const stat = Array.from(districts.entries())
    .map(
      (e) =>
        `<i>${
          (e[0].length && e[0]) || "Не указан"
        }</i>: <b>${e[1]}</b>`,
    )
    .sort();

  const text = [
    `🚲 Статистика по событию <b>${bikeday.title}</b>`,
    "",
    "📍 <b>Районы:</b>",
    ...stat,
    "",
    `🎉 Всего участников <b>${
      bikeday.EventParticipation.length
    }</b>. Из них с браслетами <b>${
      bikeday.EventParticipation.filter(
        (e) => e.band != null,
      ).length
    }</b>`,
  ].join("\n");
  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text,
    parse_mode: "HTML",
    reply_markup: {
      remove_keyboard: true,
    },
  };
};
