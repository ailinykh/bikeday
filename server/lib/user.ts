import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findUserByToken(token) {
  const session = await prisma.session.findFirst({
    where: {
      token,
      status: 'valid',
    },
  })
  if (!session) {
    throw Error('session not found')
  }
  const user = await prisma.user.findFirst({
    where: {
      phone: session.phone,
    },
  })
  if (!user) {
    throw Error('user not found')
  }
  return user
}

export { findUserByToken }
