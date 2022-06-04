import { getSmscBalance } from '~/server/lib/smsc'

export default defineEventHandler((event) => {
  return getSmscBalance()
})
