import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const { bike, district } = await useBody(event)
  try {
    const res = await handle({ token: session, bike, district })
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

async function handle({ token, bike, district }) {
  if (bike.length == 0) {
    throw Error('велосипед не указан')
  }

  if (district.length == 0) {
    throw Error('район не указан')
  }

  const event = await prisma.event.findFirst({
    where: {
      title: 'Велодень 2022',
    },
  })
  const user = await findUserByToken(token)
  const participation = await prisma.eventParticipation.create({
    data: {
      userId: user.id,
      eventId: event.id,
      bike,
      district,
      band: '',
      bandedBy: 0,
    },
  })
  return { participation }
}
