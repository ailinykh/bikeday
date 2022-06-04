<script setup>
useMeta({
  bodyAttrs: {
    class: 'body-white',
  },
})

import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const session = useSessionStore()

if (session.user) {
  console.log('user already exists. redirecting to profile')
  navigateTo('/profile')
}

const { createdAt } = storeToRefs(session)
</script>

<template>
  <div>
    <UserCode v-if="createdAt" />
    <UserLogin v-else />
  </div>
</template>
