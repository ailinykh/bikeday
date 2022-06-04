<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const session = useSessionStore()
if (session.user) {
  session.destroy()
}
setTimeout(() => navigateTo('/'), 100)
</script>

<template>
  <div />
</template>
