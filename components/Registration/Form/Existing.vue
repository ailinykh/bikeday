<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user'

const userStore = useUserStore()

const { isLoading, users } = storeToRefs(userStore)
const { findByPhone } = userStore

const phone = ref('')
const band = ref('')
const selectedUser = ref()

const handleUserSelection = (user) => {
  selectedUser.value = user
}

const handleBand = async () => {
  await userStore.band(selectedUser.id, band.value)
  band.value = ''
  phone.value = ''
}

onMounted(() => {
  userStore.$reset()
  phone.value = ''
})
</script>

<template>
  <div class="my-4">
    <form
      @submit.prevent="findByPhone(phone)"
      class="needs-validation"
      v-if="users.length == 0"
    >
      <div class="form-floating mb-4">
        <input
          type="tel"
          class="form-control"
          id="phone"
          autocomplete="off"
          v-model="phone"
        />
        <label for="phone">Последние 4 цифры телефона</label>
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
        Найти
      </button>
    </form>
    <form @submit.prevent="handleBand()" class="needs-validation" v-else>
      <div class="form-floating mb-4">
        <input
          type="tel"
          class="form-control"
          id="band"
          autocomplete="off"
          v-model="band"
        />
        <label for="band">Браслет</label>
      </div>
      <div class="form-check form-check-inline my-1" v-for="user in users">
        <input
          class="form-check-input"
          type="radio"
          name="status"
          :id="user.id"
          :value="user.id"
          :click="handleUserSelection(user)"
        />
        <label class="form-check-label" :for="user.id"
          >{{ user.firstName }} {{ user.lastName }} {{ user.phone }}</label
        >
      </div>
      <button
        class="w-100 btn btn-primary my-4"
        type="submit"
        :disabled="isLoading && !selectedUser"
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
