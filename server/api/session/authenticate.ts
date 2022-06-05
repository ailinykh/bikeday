import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { token } = await useBody(event)

  try {
    const res = await handle({ token })
    return {
      ...res,
      success: true,
    }
  } catch (e) {
    setCookie(event, 'session', null)
    return {
      error: e.message,
      success: false,
    }
  }
})

async function handle({ token }) {
  const session = await prisma.session.findFirst({
    where: {
      token,
      status: 'valid',
    },
  })
  if (!session) {
    throw Error('invalid session token')
  }
  const user = await prisma.user.findFirst({
    where: {
      OR: { phone: session.phone },
      NOT: { status: 'child' },
    },
    include: {
      eventParticipations: true,
      contestParticipations: true,
    },
  })
  // TODO: duplicated code
  const isVolunteer = user.status == 'volunteer' || user.status == 'admin'
  const isAdmin = user.status == 'admin'
  return { user, isVolunteer, isAdmin }
}
