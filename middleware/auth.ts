export default defineNuxtRouteMiddleware((to, from) => {
  const cookie = useCookie('session')
  if (!cookie.value) {
    console.log('🥵 user not exists! Redirecting to /login')
    return navigateTo('/login')
  }
  console.log('🔥 authorized', cookie.value)
})
