import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { code, phone } = await useBody(event)
  const data = {
    code,
    phone,
  }

  try {
    const res = await handle(data)
    if (res.session) {
      setCookie(event, 'session', res.session.token)
    }
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

async function handle({ code, phone }) {
  const session = await prisma.session.findFirst({
    where: {
      phone,
      status: 'auth',
    },
    orderBy: {
      id: 'desc',
    },
  })

  if (session.code != code) {
    throw Error('код подтверждения не совпадает')
  }

  // authorized
  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      status: 'valid',
    },
  })
  const user = await findOrCreateUser({ phone })
  return { session, user }
}

async function findOrCreateUser({ phone }) {
  const user = await prisma.user.findFirst({
    where: {
      OR: { phone },
      NOT: { status: 'child' },
    },
  })
  if (user) {
    return user
  }
  return await prisma.user.create({
    data: {
      status: 'user',
      phone,
      firstName: '',
      lastName: '',
      gender: '',
    },
  })
}
