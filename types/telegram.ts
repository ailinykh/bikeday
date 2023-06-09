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
};

export type TelegramUpdate = {
  update_id: number;
  message: TelegramMessage;
};
