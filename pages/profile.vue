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
const sessionStore = useSessionStore()
const eventStore = useEventStore()
eventStore.load()

const { user } = storeToRefs(sessionStore)
const { participation } = storeToRefs(eventStore)

sessionStore.$subscribe((store, state) => {
  console.log('profile.vue', store, state.user)
})

eventStore.$subscribe((store, state) => {
  console.log('profile.vue', state.participation)
})
</script>

<template>
  <div>
    <div v-if="user">
      <UserProfileForm
        v-if="!user.firstName || !user.lastName || !user.gender"
      />
      <UserEventForm v-else-if="!participation" />
      <UserEventParticipation v-else :user="user" />
      <!-- <UserContest :user="user" /> -->
    </div>
  </div>
</template>
