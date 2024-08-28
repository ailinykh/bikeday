import { sendSmsc } from "~/server/lib/sms/center";
import { sendSmsAero } from "~/server/lib/sms/aero";

export async function sendSms({
  phone,
  text,
}: {
  phone: string;
  text: string;
}) {
  if (import.meta.dev) {
    console.info(
      `🔕 skip sms in dev mode: ${phone} ${text}`,
    );
  } else {
    const { error } = await sendSmsc({ phone, text });
    if (error) {
      if (error == "message is denied") {
        await sendSmsAero({ phone, text });
      } else {
        console.log(`failed to send sms ${error}`);
        throw createError({
          statusCode: 500,
          statusMessage: error,
        });
      }
    }
  }
}
