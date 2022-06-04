<script setup>
useMeta({
  bodyAttrs: {
    class: 'body-green',
  },
})

import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const session = useSessionStore()

if (session.user) {
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
