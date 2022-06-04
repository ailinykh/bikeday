import { useSessionStore } from '~/store/session'

export default defineNuxtRouteMiddleware((to, from) => {
  const session = useSessionStore()
  if (!session.user) {
    return navigateTo('/login')
  }
  console.log('🔥 authorized', session.user.phone)
})
