const runtimeConfig = useRuntimeConfig()

interface SMSBalanceResponse {
  balance: string
}

interface SMSSendResponse {
  id: number
  cnt?: number
  error?: Error
}

const getSmsBalance = async () => {
  const params = {
    login: runtimeConfig.smscLogin,
    psw: runtimeConfig.smscPassword,
    charset: 'utf-8',
    fmt: 3,
  }
  console.log('sms balance', params, runtimeConfig)
  return await $fetch<SMSBalanceResponse>('https://smsc.ru/sys/balance.php', {
    params,
  })
}

const sendSms = async ({ phone, text }) => {
  const common = {
    login: runtimeConfig.smscLogin,
    psw: runtimeConfig.smscPassword,
    charset: 'utf-8',
    fmt: 3,
  }

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

export { sendSms, getSmsBalance }
