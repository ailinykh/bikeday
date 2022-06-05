<script setup lang="ts">
useMeta({
  bodyAttrs: {
    class: 'body-white',
  },
})

import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'
import { useContestStore } from '~/store/contest'

const session = useSessionStore()
const contest = useContestStore()

const { isVolunteer } = storeToRefs(session)
const { contests } = storeToRefs(contest)

if (!isVolunteer) {
  navigateTo('/')
}

contest.load()
</script>

<template>
  <div class="my-4">
    <h2>Управление конкурсами</h2>
    <div class="container">
      <table class="table align-middle">
        <thead>
          <tr>
            <th scope="col">Название</th>
            <th scope="col" class="text-center">Участники</th>
            <th scope="col" class="text-center">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contest in contests">
            <td scope="row">
              <strong>
                <NuxtLink :to="`/admin/contests/${contest.id}`">{{
                  contest.title
                }}</NuxtLink></strong
              >
            </td>
            <td class="text-center">{{ contest.participations.length }}</td>
            <td class="text-center">{{ contest.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
