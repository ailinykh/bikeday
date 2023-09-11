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
  if (
    reply_to_message &&
    reply_to_message.forward_from &&
    chat.id == chat_id
  ) {
    // reply from support
    return {
      method: "sendMessage",
      chat_id: reply_to_message.forward_from.id,
      text,
    };
  }

  if (message.chat.type != "private") {
    // no support for group chat
    return;
  }

  // initiate support dialog
  return {
    method: "forwardMessage",
    chat_id,
    from_chat_id: message.chat.id,
    message_id: message.message_id,
  };
});
