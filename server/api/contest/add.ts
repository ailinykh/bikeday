import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const { id, user } = await useBody(event)

  try {
    const u = await findUserByToken(session)
    if (u.id != id && !['admin', 'volunteer'].includes(u.status)) {
      return { error: 'not authorized' }
    }

    const res = await handle({ id, user })
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

async function handle({ id, user }) {
  const existing = await prisma.contestParticipation.findFirst({
    where: {
      contestId: id,
      userId: user.id,
    },
  })

  console.log(id, user, existing)
  if (existing) {
    throw Error('Пользователь уже является участником конкурса')
  }

  const participation = await prisma.contestParticipation.create({
    data: {
      contestId: id,
      userId: user.id,
      score: '',
    },
  })
  return { participation }
}
