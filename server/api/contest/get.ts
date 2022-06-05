import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const { id } = useQuery(event)

  try {
    const user = await findUserByToken(session)
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
  const include = ['admin', 'volunteer'].includes(user.status)
    ? { participations: true }
    : {}
  const contest = await prisma.contest.findFirst({
    where: {
      id,
    },
    include,
  })
  return { contest }
}
