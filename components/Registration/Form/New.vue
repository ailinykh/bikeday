<script setup lang="ts">
interface UserForm {
  firstName: string
  lastName: string
  gender: string
  phone: string
  band: string
}

const user = ref<UserForm>({
  firstName: '',
  lastName: '',
  gender: 'male',
  phone: '',
  band: '',
})

import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user'

const userStore = useUserStore()

const { isLoading } = storeToRefs(userStore)
const { findByPhone } = userStore

const goRegister = async () => {
  await userStore.register(user.value)
  user.value = {
    firstName: '',
    lastName: '',
    gender: 'male',
    phone: '',
    band: '',
  }
}

const goNext = (elem) => {
  const currentIndex = Array.from(elem.form.elements).indexOf(elem)
  elem.form.elements
    .item(currentIndex < elem.form.elements.length - 1 ? currentIndex + 1 : 0)
    .focus()
}
</script>

<template>
  <div class="my-4">
    <form
      @submit.prevent="goRegister()"
      class="needs-validation"
      :class="{
        // 'was-validated': error,
      }"
    >
      <div class="form-floating mb-4">
        <input
          type="text"
          class="form-control"
          id="firstName"
          autocomplete="off"
          v-model="user.firstName"
          autofocus
          v-on:keyup.enter="goNext($event.target)"
        />
        <label for="firstName">Имя</label>
      </div>
      <div class="form-floating mb-4">
        <input
          type="text"
          class="form-control"
          id="lastName"
          autocomplete="off"
          v-model="user.lastName"
          v-on:keyup.enter="goNext($event.target)"
        />
        <label for="lastName">Фамилия</label>
      </div>
      <div class="form-floating mb-4">
        <div>
          <label for="gender" class="form-label">Пол</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio3"
            value="male"
            v-model="user.gender"
            :checked="user.gender == 'male'"
          />
          <label class="form-check-label" for="inlineRadio3">мужской</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio4"
            value="female"
            v-model="user.gender"
            :checked="user.gender == 'female'"
          />
          <label class="form-check-label" for="inlineRadio4">женский</label>
        </div>
      </div>
      <div class="form-floating mb-4">
        <input
          type="tel"
          class="form-control"
          id="phone"
          autocomplete="off"
          v-model="user.phone"
          v-on:keyup.enter="goNext($event.target)"
        />
        <label for="phone">Телефон (для детей не обязательно)</label>
      </div>
      <div class="form-floating mb-4">
        <input
          type="tel"
          class="form-control"
          id="band"
          autocomplete="off"
          v-model="user.band"
          v-on:keyup.enter="goNext($event.target)"
        />
        <label for="band">Браслет</label>
      </div>
      <button
        class="w-100 btn btn-primary mb-4"
        type="submit"
        :disabled="isLoading"
      >
        <span
          v-show="isLoading"
          class="spinner-border spinner-border-sm mr-1"
        ></span>
        Зарегистрировать
      </button>
    </form>
  </div>
</template>
