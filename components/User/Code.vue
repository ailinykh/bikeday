<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const session = useSessionStore()
const { isLoading, error } = storeToRefs(session)
const { validate, create } = session

const code = ref('')
const countdown = ref('')

const getTimeout = (date) => {
  const now = new Date()
  const created = new Date(date)
  return 120 - Math.ceil((now - created) / 1000)
}

session.$subscribe((one, state) => {
  const timeout = getTimeout(state.createdAt)
  console.log('timeout', timeout)
  if (timeout > 0) {
    countdown.value = '00:02:00'
  }
})

watch(countdown, (o, n) => {
  console.log('countdown', o, n)
  setTimeout(() => {
    const timeout = getTimeout(session.createdAt)
    if (timeout > 0) {
      const minutes = Math.floor(timeout / 60)
      const seconds = timeout % 60
      countdown.value = `00:0${minutes}:${seconds > 9 ? '' : '0'}${seconds}`
    } else {
      countdown.value = ''
    }
  }, 1000)
})

countdown.value = '00:02:00'
</script>

<template>
  <div class="row g-5 justify-content-center my-3">
    <div class="col-lg-4">
      <h2>Вход</h2>
      <form
        @submit.prevent="validate(code)"
        class="needs-validation"
        :class="{
          // 'was-validated': error,
        }"
      >
        <div class="form-floating mb-4">
          <input
            type="tel"
            class="form-control"
            id="code"
            placeholder="+7 xxx-xxx-xx-xx"
            autocomplete="off"
            v-model="code"
            v-maska="'######'"
            :v-invalid="error !== null"
            :class="{
              'is-invalid': error,
            }"
            autofocus
          />
          <label for="code">Введите код из смс</label>
          <div class="invalid-feedback">{{ error }}</div>
        </div>
        <button
          class="w-100 btn btn-primary mb-4"
          type="submit"
          :disabled="isLoading || code.length < 6"
        >
          <span
            v-show="isLoading"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          Отправить
        </button>
      </form>
      <div class="form-floating mb-4">
        <p class="text-center" v-if="countdown.length">
          запросить код повторно можно через {{ countdown }}
        </p>
        <button
          v-else
          class="w-100 btn btn-secondary mb-4"
          :disabled="isLoading"
          @click="create(session.phone)"
        >
          <span
            v-show="isLoading"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          Запросить код еще раз
        </button>
      </div>
    </div>
  </div>
</template>
