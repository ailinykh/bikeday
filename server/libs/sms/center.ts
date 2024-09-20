import type {
  Message,
  MessagePublisher,
} from "~~/server/libs/sms";

interface SMSBalanceResponse {
  balance: string;
}

interface SMSSendResponse {
  id: number;
  cnt?: number;
  error?: string;
}

interface SMSStatusResponse {
  status: number;
  last_timestamp: number;
}

export class CenterMessagePublisher
  implements MessagePublisher
{
  common = {};

  constructor({
    login,
    password,
  }: {
    login: string;
    password: string;
  }) {
    this.common = {
      login: login,
      psw: password,
      charset: "utf-8",
      fmt: 3,
    };
  }

  async getSmscBalance() {
    return await $fetch<SMSBalanceResponse>(
      "https://smsc.ru/sys/balance.php",
      {
        params: this.common,
      },
    );
  }

  async getSmscStatus({
    id,
    phone,
  }: {
    id: string;
    phone: string;
  }) {
    return await $fetch<SMSStatusResponse>(
      "https://smsc.ru/sys/status.php",
      {
        params: {
          ...this.common,
          phone,
          id,
        },
      },
    );
  }

  async sendSms({
    phone,
    text,
  }: Message): Promise<Error | undefined> {
    const data = {
      phones: phone,
      mes: text,
    };

    const { id, cnt, error } =
      await $fetch<SMSSendResponse>(
        "https://smsc.ru/sys/send.php",
        {
          params: {
            ...this.common,
            ...data,
          },
        },
      );
    console.info(
      "💬 smsc",
      phone,
      "id:",
      id,
      "cnt:",
      cnt,
      "error:",
      error,
    );

    return error ? Error(error) : undefined;
  }
}
