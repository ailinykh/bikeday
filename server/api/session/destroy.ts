import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  try {
    await handle({ token: session })
    setCookie(event, 'session', null)
    return {
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
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        status: 'logout',
      },
    })
  }
}
