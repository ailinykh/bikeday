export interface Message {
  phone: string;
  text: string;
}

export interface MessagePublisher {
  sendSms(message: Message): Promise<Error | undefined>;
}
