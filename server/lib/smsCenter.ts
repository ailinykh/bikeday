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

const common = {
  login: process.env.SMSC_LOGIN,
  psw: process.env.SMSC_PASSWORD,
  charset: "utf-8",
  fmt: 3,
};

const getSmscBalance = async () => {
  return await $fetch<SMSBalanceResponse>(
    "https://smsc.ru/sys/balance.php",
    {
      params: common,
    }
  );
};

const getSmscStatus = async ({
  id,
  phone,
}: {
  id: string;
  phone: string;
}) => {
  return await $fetch<SMSStatusResponse>(
    "https://smsc.ru/sys/status.php",
    {
      params: {
        ...common,
        phone,
        id,
      },
    }
  );
};

const sendSmsc = async ({
  phone,
  text,
}: {
  phone: string;
  text: string;
}) => {
  const data = {
    phones: phone,
    mes: text,
  };

  const { id, cnt, error } = await $fetch<SMSSendResponse>(
    "https://smsc.ru/sys/send.php",
    {
      params: {
        ...common,
        ...data,
      },
    }
  );
  console.log(
    "💬 smsc",
    phone,
    "id:",
    id,
    "cnt:",
    cnt,
    "error:",
    error
  );

  return { cnt, error };
};

export { sendSmsc, getSmscBalance, getSmscStatus };
