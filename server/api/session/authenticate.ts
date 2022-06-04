import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { token } = await useBody(event)

  try {
    const res = await handle({ token })
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
  const session = await prisma.session.findFirst({
    where: {
      token,
      status: 'valid',
    },
  })
  if (session) {
    const user = await prisma.user.findFirst({
      where: {
        OR: { phone: session.phone },
        NOT: { status: 'child' },
      },
    })
    return { user }
  }
  return {}
}
