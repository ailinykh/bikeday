interface SMSResponse {
  success: boolean;
  data: {
    id: number;
    number: string;
    status: number;
    extendStatus: string;
  };
}

const { smsAero } = useRuntimeConfig();
const token = Buffer.from(
  `${smsAero.login}:${smsAero.password}`,
).toString("base64");

const getSmsAeroStatus = async ({ id }: { id: string }) => {
  return await $fetch(
    "https://gate.smsaero.ru/v2/sms/status",
    {
      headers: {
        Authorization: `Basic ${token}`,
      },
      params: {
        id,
      },
    },
  );
};

const sendSmsAero = async ({
  phone,
  text,
}: {
  phone: string;
  text: string;
}) => {
  const {
    success,
    data: { id, status, extendStatus },
  } = await $fetch<SMSResponse>(
    "https://gate.smsaero.ru/v2/sms/send",
    {
      headers: {
        Authorization: `Basic ${token}`,
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
  return { id, status };
};

export { sendSmsAero };
