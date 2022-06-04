import { getSmsBalance } from '@/server/lib/sms'

export default defineEventHandler((event) => {
  console.log(process.env)
  return getSmsBalance()
})
