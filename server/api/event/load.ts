import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  try {
    const res = await handle({ token: session })
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

async function handle({ token }) {
  const event = await prisma.event.findFirst({
    where: {
      title: 'Велодень 2022',
    },
  })
  const user = await findUserByToken(token)
  const participation = await prisma.eventParticipation.findFirst({
    where: {
      userId: user.id,
      eventId: event.id,
    },
  })
  return { participation }
}
