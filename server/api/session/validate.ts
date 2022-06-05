import { PrismaClient } from '@prisma/client'

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
      console.log('✅ session is valid', res.session.token)
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
  // TODO: duplicated code
  const isVolunteer = user.status == 'volunteer' || user.status == 'admin'
  const isAdmin = user.status == 'admin'
  return { session, user, isVolunteer, isAdmin }
}

async function findOrCreateUser({ phone }) {
  const user = await prisma.user.findFirst({
    where: {
      OR: { phone },
      NOT: { status: 'child' },
    },
    include: {
      eventParticipations: true,
      contestParticipations: true,
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
