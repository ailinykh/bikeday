<script setup>
import { useSessionStore } from '~/store/session'

const session = useSessionStore()
const cookie = useCookie('session')

if (cookie.value && !session.user) {
  session.authenticate(cookie.value)
}
</script>

<template>
  <div>
    <Nav />
    <div class="container">
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
