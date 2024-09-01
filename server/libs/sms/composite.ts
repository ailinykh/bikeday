import type {
  Message,
  MessagePublisher,
} from "~/server/libs/sms";

import { CenterMessagePublisher } from "~/server/libs/sms/center";
import { AeroMessagePublisher } from "~/server/libs/sms/aero";

const { messagePublishers } = useRuntimeConfig();

export class CompositeMessagePublisher
  implements MessagePublisher
{
  publishers: MessagePublisher[] = [];

  constructor() {
    for (const {
      name,
      login,
      password,
    } of messagePublishers as []) {
      switch (name) {
        case "center":
          this.publishers.push(
            new CenterMessagePublisher({ login, password }),
          );
        case "aero":
          this.publishers.push(
            new AeroMessagePublisher({ login, password }),
          );
      }
    }
  }

  async sendSms({
    phone,
    text,
  }: Message): Promise<Error | undefined> {
    if (import.meta.dev || import.meta.test) {
      console.info(
        `🔕 skip sms in dev mode: ${phone} ${text}`,
      );
      return;
    }

    let error: Error | undefined;
    for (const publisher of this.publishers) {
      error = await publisher.sendSms({
        phone,
        text,
      });
      // try another publisher in case of "message is denied"
      if (error?.message != "message is denied") {
        return error;
      }
    }
    return error;
  }
}
