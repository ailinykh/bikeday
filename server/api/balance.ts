import { getSmsBalance } from '@/server/lib/sms'

export default defineEventHandler((event) => {
  return getSmsBalance()
})
