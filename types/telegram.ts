export type TelegramUser = {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
};

export type TelegramContact = {
  phone_number: string;
  first_name: string;
  last_name: string;
  user_id: number;
};

export type TelegramPrivateChat = TelegramUser & {
  type: "private";
};

export type TelegramEntity = {
  offset: number;
  length: number;
  type: string;
};

export type TelegramMessage = {
  message_id: number;
  from: TelegramUser;
  chat: TelegramPrivateChat;
  date: number;
  text?: string;
  contact?: TelegramContact;
  entities?: [TelegramEntity];
  reply_to_message?: TelegramMessage;
  forward_from?: TelegramUser;
};

export type TelegramCallbackQuery = {
  data: string;
  from: TelegramUser;
  message: TelegramMessage;
};

export type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
};

export type TelegramContext = {
  update: TelegramUpdate;
};
