export default defineEventHandler(async (event) => {
  const { session } = useCookies(event)
  if (!event.req.url.startsWith('/__')) {
    console.log('✅ server auth middleware', event.req.url, 'session:', session)
  }
})
