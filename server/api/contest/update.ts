import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const { id, update } = await useBody(event)

  try {
    const { status } = await findUserByToken(session)
    if (!['admin', 'volunteer'].includes(status)) {
      return { error: 'not authorized' }
    }

    const res = await handle({ id, update })
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

async function handle({ id, update }) {
  const contest = await prisma.contest.update({
    where: {
      id,
    },
    data: update,
  })
  return { contest }
}
