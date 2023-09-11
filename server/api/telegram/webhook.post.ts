import { TelegramUpdate } from "~/types/telegram";
import {
  protectRequest,
  handleStart,
  handleContact,
  handlePing,
} from "../../lib/telegram";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  protectRequest(event);

  const update = await readBody<TelegramUpdate>(event);
  const { message } = update;

  if (!message) {
    // ignore technical updates
    // TODO: respect `edited_message` for support chat
    return;
  }

  // console.debug("💬", update);

  if (message.text?.startsWith("/start")) {
    return handleStart(message, event);
  }

  if (message.contact) {
    return handleContact(message, event);
  }

  const chat_id = parseInt(config.telegram.supportChatId);
  const { reply_to_message, chat, text } = message;
  if (reply_to_message && chat.id == chat_id) {
    // reply from support
    const match =
      reply_to_message.text?.match(/^.+\[(\d+)\]/);
    if (!match) {
      return {
        method: "sendMessage",
        chat_id,
        text: `❌ chat_id not found in "${reply_to_message.text}"`,
      };
    }

    return {
      method: "sendMessage",
      chat_id: match[1],
      text,
    };
  }

  if (message.chat.type != "private") {
    // no support for group chat
    return;
  }

  const { id, first_name, last_name } = message.from;
  // initiate support dialog
  return {
    method: "sendMessage",
    chat_id,
    text: `💬 <b><a href="tg://user?id=${id}">${first_name} ${last_name}</a></b> [${id}]:\n${text}`,
    parse_mode: "HTML",
  };
});
