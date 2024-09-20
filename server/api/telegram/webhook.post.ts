import type { TelegramContext } from "~~/types/telegram";
import {
  handleContact,
  handleStart,
  handleStatistics,
} from "~~/server/libs/telegram";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { update }: TelegramContext =
    event.context.telegram;
  const { message } = update;

  // console.debug("💬", update);

  if (!message) {
    // ignore technical updates
    // TODO: respect `edited_message` for support chat
    return;
  }

  if (message.text?.startsWith("/start")) {
    return handleStart(message, event);
  }

  if (message.text?.startsWith("/statistics")) {
    return handleStatistics(message, event);
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

  if (!text) {
    // user sent media or something
    return {
      method: "forwardMessage",
      chat_id,
      from_chat_id: chat.id,
      message_id: message.message_id,
    };
  }

  const { id, first_name, last_name } = message.from;
  const displayName = last_name
    ? first_name + " " + last_name
    : first_name;
  // initiate support dialog
  return {
    method: "sendMessage",
    chat_id,
    text: `💬 <b><a href="tg://user?id=${id}">${displayName}</a></b> [${id}]:\n${text}`,
    parse_mode: "HTML",
  };
});
