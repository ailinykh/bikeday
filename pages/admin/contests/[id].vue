<script setup>
useMeta({
  bodyAttrs: {
    class: 'body-white',
  },
})

import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'
import { useContestStore } from '~/store/contest'
import { useUserStore } from '~/store/user'

const session = useSessionStore()
const contestStore = useContestStore()
const userStore = useUserStore()

const { isVolunteer } = storeToRefs(session)
const { contests } = storeToRefs(contestStore)
const { user, error } = storeToRefs(userStore)

const { update } = contestStore

const contest = ref({})

const band = ref('')

const route = useRoute()
const id = route.params.id

contestStore.$subscribe((store, state) => {
  contest.value = state.contests.find((c) => c.id == id)
})

const { findByBand } = userStore

const addByBand = async () => {
  await contestStore.add(contest.value.id, user.value)
  userStore.$patch({
    user: null,
  })
}

onMounted(() => {
  if (!isVolunteer) {
    navigateTo('/')
  }
  contestStore.load()
})
</script>

<template>
  <div class="my-4">
    <h2>{{ contest.title }}</h2>
    <div class="p-3 bg-light rounded-3">
      <div class="row">
        <div class="col">
          <strong
            >Регистрация
            {{ contest.status == 'closed' ? 'закрыта' : 'открыта' }}</strong
          >
        </div>
        <div class="col">
          <button
            class="btn btn-link"
            @click="update(contest.id, { status: 'closed' })"
            v-show="contest.status == 'open'"
          >
            Закрыть
          </button>
          <button
            class="btn btn-link"
            @click="update(contest.id, { status: 'open' })"
            v-show="contest.status == 'closed'"
          >
            Открыть
          </button>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col">
          <h4>Добавить участника</h4>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto">
          <label for="addUserToContest" class="col-form-label"
            >Номер браслета</label
          >
        </div>
        <div class="col-auto">
          <input
            type="tel"
            id="user"
            class="form-control"
            aria-describedby="addUserToContest"
            v-model="band"
            :class="{
              'is-invalid': error,
            }"
          />
          <div class="invalid-feedback">{{ error }}</div>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" @click="findByBand(band)">
            Найти
          </button>
        </div>
      </div>
      <div class="row g-3 align-items-center my-3" v-if="user">
        <div class="col-auto">
          <strong>{{ user.firstName }} {{ user.lastName }}</strong>
        </div>
        <div class="col-auto">
          <a href="#" @click="addByBand()">Добавить</a>
        </div>
      </div>
    </div>

    <h3 class="mt-4 mb-2">Участники</h3>
    <table
      class="table align-middle"
      v-if="contest.participations && contest.participations.length > 0"
    >
      <thead>
        <tr>
          <th scope="col">Имя Фамилия</th>
          <th scope="col" class="text-center">Результат</th>
          <th scope="col" class="text-center"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in contest.participations">
          <td scope="row">{{ user.firstName }} {{ user.lastName }}</td>
          <td class="text-center">{{ user.scope }}</td>
          <td class="text-center"></td>
        </tr>
      </tbody>
    </table>
    <p v-else>Пока никого нет</p>
  </div>
</template>
