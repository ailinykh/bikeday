import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const { id, band } = await useBody(event)

  try {
    const user = await findUserByToken(session)
    if (!['admin', 'volunteer'].includes(user.status)) {
      return { error: 'not authorized' }
    }
    const res = await handle({ id, band, user })
    return {
      ...res,
      success: true,
    }
  } catch (e) {
    console.error(e)
    return {
      error: e.message,
      success: false,
    }
  }
})

async function handle({ id, band, user }) {
  const event = await prisma.event.findFirst({
    where: {
      title: 'Велодень 2023',
    },
  })
  const participation = await prisma.eventParticipation.findFirst({
    where: {
      eventId: event.id,
      userId: id,
    },
  })

  if (participation) {
    return await prisma.eventParticipation.update({
      where: {
        id: participation.id,
      },
      data: {
        band,
        bandedBy: user.id,
      },
    })
  }
  return await prisma.eventParticipation.create({
    data: {
      eventId: event.id,
      userId: id,
      district: '',
      bike: '',
      band,
      bandedBy: user.id,
    },
  })
}
