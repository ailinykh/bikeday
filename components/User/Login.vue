<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const session = useSessionStore()
const phone = ref('')

const { isLoading, error } = storeToRefs(session)
const { create } = session
</script>

<template>
  <div class="row g-5 justify-content-center my-3">
    <div class="col-lg-4">
      <h2>Вход</h2>
      <form
        @submit.prevent="create(phone)"
        class="needs-validation"
        :class="{
          // 'was-validated': error,
        }"
      >
        <div class="form-floating mb-4">
          <input
            type="tel"
            class="form-control"
            id="phone"
            placeholder="+7 xxx-xxx-xx-xx"
            autocomplete="off"
            v-model="phone"
            v-maska="'+7 (###) ###-##-##'"
            :v-invalid="error !== null"
            :class="{
              'is-invalid': error,
            }"
            autofocus
          />
          <label for="phone">Введите ваш номер телефона</label>
          <div class="invalid-feedback">{{ error }}</div>
        </div>
        <button
          class="w-100 btn btn-primary"
          type="submit"
          :disabled="isLoading || phone.length < 18"
        >
          <span
            v-show="isLoading"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          Получить код
        </button>
      </form>
    </div>
  </div>
</template>
