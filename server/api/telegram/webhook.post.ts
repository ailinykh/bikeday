import { TelegramUpdate } from "~/types/telegram";
import {
  protectRequest,
  handleStart,
  handleContact,
} from "../../lib/telegram";

export default defineEventHandler(async (event) => {
  protectRequest(event);

  const { message } = await readBody<TelegramUpdate>(event);
  console.log(message);

  if (message.text?.startsWith("/start")) {
    return handleStart(message, event);
  }

  if (message.contact) {
    return handleContact(message, event);
  }

  return {
    method: "sendMessage",
    chat_id: message.chat.id,
    text: "Неизвестная команда 😢",
  };
});
