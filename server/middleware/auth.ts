export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  console.log('✅ server auth middleware', event.req.url, 'session:', session)
})
