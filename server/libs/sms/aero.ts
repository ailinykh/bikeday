import type {
  Message,
  MessagePublisher,
} from "~/server/libs/sms";

interface SMSResponse {
  success: boolean;
  data: {
    id: number;
    number: string;
    status: number;
    extendStatus: string;
  };
}

export class AeroMessagePublisher
  implements MessagePublisher
{
  token = "";

  constructor({
    login,
    password,
  }: {
    login: string;
    password: string;
  }) {
    this.token = Buffer.from(
      `${login}:${password}`,
    ).toString("base64");
  }

  async getSmsAeroStatus({ id }: { id: string }) {
    return await $fetch(
      "https://gate.smsaero.ru/v2/sms/status",
      {
        headers: {
          Authorization: `Basic ${this.token}`,
        },
        params: {
          id,
        },
      },
    );
  }

  async sendSms({
    phone,
    text,
  }: Message): Promise<Error | undefined> {
    const {
      success,
      data: { id, status, extendStatus },
    } = await $fetch<SMSResponse>(
      "https://gate.smsaero.ru/v2/sms/send",
      {
        headers: {
          Authorization: `Basic ${this.token}`,
        },
        params: {
          number: phone,
          sign: "SMS Aero",
          text,
        },
      },
    );

    console.info(
      "💬 sms aero",
      phone,
      "success:",
      success,
      "id:",
      id,
      "status:",
      status,
      "extendStatus",
      extendStatus,
    );
    return success ? undefined : Error(extendStatus);
  }
}
