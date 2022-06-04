import { getSmsBalance } from '~/server/lib/smsc'

export default defineEventHandler((event) => {
  return getSmsBalance()
})
