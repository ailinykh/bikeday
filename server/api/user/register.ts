import { findUserByToken } from '~/server/lib/user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  const data = await useBody(event)

  try {
    const user = await findUserByToken(session)
    if (!['admin', 'volunteer'].includes(user.status)) {
      return { error: 'not authorized' }
    }
    const res = await handle({ data, user })
    return {
      ...res,
      success: true,
    }
  } catch (e) {
    console.error(e)
    return {
      error: e.message,
      success: false,
    }
  }
})

async function handle({ data, user }) {
  const phone = data.phone.replace(/\D+/g, '').replace(/^8/g, '7')
  const event = await prisma.event.findFirst({
    where: {
      title: 'Велодень 2023',
    },
  })

  const created = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      phone: phone,
      status: 'user',
    },
  })

  return await prisma.eventParticipation.create({
    data: {
      eventId: event.id,
      userId: created.id,
      district: '',
      bike: '',
      band: data.band,
      bandedBy: user.id,
    },
  })
}
