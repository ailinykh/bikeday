export default defineEventHandler(async (event) => {
  console.log(event.req.headers)
  const { session } = useCookies(event)
  if (!event.req.url.startsWith('/__')) {
    console.log('✅ server auth middleware', event.req.url, 'session:', session)
  }
})
