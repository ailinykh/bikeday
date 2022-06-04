import { getSmsStatus } from '~/server/lib/smsc'

export default defineEventHandler((event) => {
  const { id, phone } = useQuery(event)
  return getSmsStatus({ id, phone })
})
