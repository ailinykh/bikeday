<script setup>
import { storeToRefs } from 'pinia'
import { useContestStore } from '~/store/contest'

const props = defineProps({
  user: Object,
})

const contestStore = useContestStore()
const { isLoading } = storeToRefs(contestStore)
const selectedContest = ref(0)

const availableContests = ref([])
const myContests = ref([])

const addToContest = () => {
  contestStore.add(selectedContest.value, props.user)
}

const cancelParticipation = (contest) => {
  if (
    confirm(
      `Вы действительно хотите отказаться от участия в "${contest.title}"`
    )
  ) {
    const p = contestStore.participations.find((p) => p.contestId == contest.id)
    contestStore.cancel(p.id)
  }
}

contestStore.$subscribe((store, state) => {
  const { contests, participations, opened } = state
  const my = participations.map((p) =>
    contests.find((c) => c.id == p.contestId)
  )

  myContests.value = my
  availableContests.value = opened.filter(
    (c) => my.find((mc) => mc.id == c.id) == undefined
  )
})

contestStore.load()
</script>

<template>
  <div>
    <h2>Конкурсы</h2>
    <form
      v-if="availableContests.length > 0"
      @submit.prevent="addToContest()"
      class="needs-validation"
      :class="{
        // 'was-validated': error,
      }"
    >
      <div class="mb-3">
        <select
          class="form-select"
          aria-label="Выберите конкурс"
          v-model="selectedContest"
        >
          <option v-for="contest in availableContests" :value="contest.id">
            {{ contest.title }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <button
          class="w-100 btn btn-primary mb-4"
          type="submit"
          :disabled="isLoading"
        >
          <span
            v-show="isLoading"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          Принять участие
        </button>
      </div>
    </form>
    <p v-else>На данный момент нет открытых для регистрации конкурсов</p>
    <div v-show="myContests.length > 0">
      <h3>Ваши конкурсы</h3>
      <table class="table align-middle">
        <tbody>
          <tr v-for="contest in myContests">
            <td scope="row">
              {{ contest.title }}
            </td>
            <td class="text-center">
              <strong>
                <button
                  class="btn btn-link"
                  @click="cancelParticipation(contest)"
                >
                  отказаться от участия
                </button>
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
button.btn-link {
  text-decoration: none;
  font-weight: bold;
}
</style>
