import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const { id } = useQuery(event)
  const pId = parseInt(id, 10)
  try {
    const user = await findUserByToken(session)
    const res = await handle({ id: pId, user })
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
  const participation = await prisma.contestParticipation.findUnique({
    where: {
      id,
    },
  })

  if (
    user.id != participation.userId &&
    !['admin', 'volunteer'].includes(user.status)
  ) {
    return { error: 'not authorized' }
  }

  return await prisma.contestParticipation.delete({
    where: { id },
  })
}
