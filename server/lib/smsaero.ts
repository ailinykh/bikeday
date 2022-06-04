interface SMSResponse {
  success: boolean
  data?: {
    id: number
    number: string
    status: number
    extendStatus: string
  }
}

const login = process.env.SMSAERO_LOGIN
const password = process.env.SMSAERO_PASSWORD
const token = Buffer.from(`${login}:${password}`).toString('base64')

const getSmsAeroStatus = async ({ id }) => {
  return await $fetch<SMSResponse>('https://gate.smsaero.ru/v2/sms/status', {
    headers: {
      Authorization: `Basic ${token}`,
    },
    params: {
      id,
    },
  })
}

const sendSmsAero = async ({ phone, text }) => {
  const {
    success,
    data: { id, status, extendStatus },
  } = await $fetch<SMSResponse>('https://gate.smsaero.ru/v2/sms/send', {
    headers: {
      Authorization: `Basic ${token}`,
    },
    params: {
      number: phone,
      sign: 'SMS Aero',
      text,
    },
  })

  console.log(
    '💬 sms aero',
    phone,
    'success:',
    success,
    'id:',
    id,
    'status:',
    status,
    'extendStatus',
    extendStatus
  )
  return { id, status }
}

export { sendSmsAero }
