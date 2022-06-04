import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkForSpam(ip: string) {
  const now = new Date()
  const sessions = await prisma.session.count({
    where: {
      ip,
      status: 'auth',
      createdAt: {
        gte: new Date(now.getTime() - 5 * 60_000),
      },
    },
  })
  if (sessions > 100) {
    throw Error('too many code requests')
  }
}

export { checkForSpam }
