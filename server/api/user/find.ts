import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const { band, phone } = useQuery(event)

  try {
    const user = await findUserByToken(session)
    if (!['admin', 'volunteer'].includes(user.status)) {
      return { error: 'not authorized' }
    }

    let res: Object
    if (band) {
      res = await findByBand(band)
    } else {
      res = await findByPhone(phone)
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

async function findByBand(band) {
  const event = await prisma.event.findFirst({
    where: {
      title: 'Велодень 2023',
    },
  })
  const participation = await prisma.eventParticipation.findFirst({
    where: {
      eventId: event.id,
      band,
    },
    include: {
      user: true,
    },
  })

  if (!participation) {
    throw Error('пользователь не найден')
  }

  return { user: participation.user }
}

async function findByPhone(phone) {
  const user = await prisma.user.findFirst({
    where: {
      phone,
    },
  })
  if (user) {
    return { user }
  }

  const users = await prisma.user.findMany({
    where: {
      phone: {
        endsWith: phone,
      },
    },
    include: {
      eventParticipations: true,
    },
  })
  return { users }
}
