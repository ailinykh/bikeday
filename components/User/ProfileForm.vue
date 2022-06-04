<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'
import { useProfileStore } from '~/store/profile'
const session = useSessionStore()
const profile = useProfileStore()

const { isLoading } = storeToRefs(profile)
const { update } = profile

const firstName = ref(session.user.firstName)
const lastName = ref(session.user.lastName)
const gender = ref(session.user.gender)
</script>

<template>
  <div class="">
    <h2 class="mt-4">Анкета участника</h2>
    <p>
      Для оформления грамот нам очень нужны ваши имя, фамилия и пол. Убедитесь,
      пожалуйста, что они заполнены корректно.
    </p>
    <form
      @submit.prevent="update({ firstName, lastName, gender })"
      class="needs-validation"
      :class="{
        // 'was-validated': error,
      }"
    >
      <div class="mb-3">
        <label for="firstName" class="form-label">Ваше имя</label>
        <input
          type="text"
          class="form-control"
          id="firstName"
          autocapitalize="on"
          v-model="firstName"
        />
      </div>
      <div class="mb-3">
        <label for="lastName" class="form-label">Ваша фамилия</label>
        <input
          type="text"
          class="form-control"
          id="lastName"
          autocapitalize="on"
          v-model="lastName"
        />
      </div>
      <div class="mb-3">
        <div>
          <label for="gender" class="form-label">Ваш пол</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio1"
            value="male"
            v-model="gender"
            :checked="gender == 'male'"
          />
          <label class="form-check-label" for="inlineRadio1">мужской</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio2"
            value="female"
            v-model="gender"
            :checked="gender == 'female'"
          />
          <label class="form-check-label" for="inlineRadio2">женский</label>
        </div>
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
          Отправить
        </button>
      </div>
    </form>
  </div>
</template>
