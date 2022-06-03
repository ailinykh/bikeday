import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const { firstName, lastName, gender } = await useBody(event)
  try {
    const res = await handle({ token: session, firstName, lastName, gender })
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

async function handle({ token, firstName, lastName, gender }) {
  if (firstName.length == 0) {
    throw Error('имя не может быть пустым')
  }

  if (lastName.length == 0) {
    throw Error('фамилия не может быть пустой')
  }

  if (gender.length == 0) {
    throw Error('пол не указан')
  }

  const user = await findUserByToken(token)
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstName,
      lastName,
      gender,
      updatedAt: new Date(),
    },
  })

  const updated = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  })
  return { user: updated }
}
