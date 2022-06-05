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
  const contests = await getContestsFor(event, user)

  // TODO: participations should be filtered by current event
  const participations = await prisma.contestParticipation.findMany({
    where: {
      userId: user.id,
    },
  })
  const opened = contests.filter((c) => c.status == 'open')
  return { contests, opened, participations }
}

async function getContestsFor(event, user) {
  const include = ['admin', 'volunteer'].includes(user.status)
    ? { participations: true }
    : {}
  return await prisma.contest.findMany({
    where: {
      eventId: event.id,
    },
    include,
  })
}
