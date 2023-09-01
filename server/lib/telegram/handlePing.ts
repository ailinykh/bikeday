import { TelegramMessage } from "~/types/telegram";
import { H3Event } from "h3";

export const handlePing = async (
  message: TelegramMessage,
  event: H3Event,
) => {
  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: "🏓 pong",
  };
};
