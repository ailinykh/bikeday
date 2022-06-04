import { useSessionStore } from '~/store/session'

const session = useSessionStore()

export default defineNuxtRouteMiddleware((to, from) => {
  if (!session.user) {
    return navigateTo('/login')
  }
  console.log('🔥 authorized', session.user.phone)
})
