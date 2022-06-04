<script setup>
useMeta({
  bodyAttrs: {
    class: 'body-white',
  },
})
definePageMeta({
  middleware: 'auth',
})
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'
import { useEventStore } from '~/store/event'
const session = useSessionStore()
const event = useEventStore()

const { user } = storeToRefs(session)
const { participation } = storeToRefs(event)

session.$subscribe((store, state) => {
  console.log('profile.vue', store, state.user)
})

event.$subscribe((store, state) => {
  console.log('profile.vue', state.participation)
})

event.load()
</script>

<template>
  <div>
    <UserProfileForm v-if="!user.firstName || !user.lastName || !user.gender" />
    <UserEventForm v-else-if="!participation" />
    <UserEventParticipation v-else />
  </div>
</template>
