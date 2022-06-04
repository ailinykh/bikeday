import { getSmscStatus } from '~/server/lib/smsc'

export default defineEventHandler((event) => {
  const { id, phone } = useQuery(event)
  return getSmscStatus({ id, phone })
})
