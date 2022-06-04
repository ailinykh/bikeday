const runtimeConfig = useRuntimeConfig()

interface SMSBalanceResponse {
  balance: string
}

interface SMSSendResponse {
  id: number
  cnt?: number
  error?: Error
}

interface SMSStatusResponse {
  status: number
  last_timestamp: number
}

const common = {
  login: process.env.SMSC_LOGIN,
  psw: process.env.SMSC_PASSWORD,
  charset: 'utf-8',
  fmt: 3,
}

const getSmsBalance = async () => {
  return await $fetch<SMSBalanceResponse>('https://smsc.ru/sys/balance.php', {
    params: common,
  })
}

const getSmsStatus = async ({ phone, id }) => {
  return await $fetch<SMSStatusResponse>('https://smsc.ru/sys/status.php', {
    params: {
      ...common,
      phone,
      id,
    },
  })
}

const sendSms = async ({ phone, text }) => {
  const data = {
    phones: phone,
    mes: text,
  }

  const { id, cnt, error } = await $fetch<SMSSendResponse>(
    'https://smsc.ru/sys/send.php',
    {
      params: {
        ...common,
        ...data,
      },
    }
  )

  console.log('💬 smsc', phone, 'id:', id, 'cnt:', cnt, 'error:', error)

  if (id % 15 == 0) {
    const { balance } = await getSmsBalance()
    await notify(`Баланс SMS составляет <b>${balance}</b> руб.`)
  }

  return { cnt, error }
}

const notify = async (text) => {
  await $fetch(
    `https://api.telegram.org/bot${runtimeConfig.botToken}/sendMessage`,
    {
      method: 'POST',
      body: {
        chat_id: runtimeConfig.botChatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      },
    }
  )
}

export { sendSms, getSmsBalance, getSmsStatus }