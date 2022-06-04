import { randomUUID } from 'crypto'

import { normalizePhone, validatePhone } from '~/server/lib/phone'
import { checkForSpam } from '~/server/lib/session'
import { sendSms } from '~/server/lib/sms'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const ip = event.req.socket.remoteAddress || '127.0.0.1'
  const ua = event.req.headers['user-agent']
  const body = await useBody(event)
  const phone = normalizePhone(body.phone)
  const data = {
    phone,
    ip,
    ua,
  }

  try {
    const res = await handle(data)
    return {
      ...res,
      success: true,
    }
  } catch (e) {
    return {
      error: e.message,
      success: false,
    }
  }
})

async function handle({ phone, ip, ua }) {
  validatePhone(phone)
  await checkForSpam(ip)

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  console.info(`creating login code ${code} for ${phone} ip: ${ip}`)

  const session = await prisma.session.create({
    data: {
      status: 'auth',
      phone,
      code,
      token: randomUUID(),
      ip,
      ua,
    },
  })

  const text = [
    `${session.code} - код подтверждения для входа.`,
    'Велодень 2022', //TODO: replace to current event title
  ].join('\n')

  sendSms({ phone, text })

  return (({ phone, createdAt }) => ({ phone, createdAt }))(session)
}
