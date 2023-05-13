<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    defaultValue: false,
  },
  errorMessage: String,
});

defineEmits(["login:phone"]);

const phone = ref("");
</script>

<template>
  <div class="w-80 m-auto">
    <h2 class="text-5xl text-center font-medium py-10">
      Вход
    </h2>
    <form
      @submit.prevent="() => $emit('login:phone', phone)"
      class=""
    >
      <div class="mb-6">
        <label
          for="phone"
          class="block text-sm leading-6 text-gray-900"
          >Введите ваш номер телефона</label
        >
        <input
          type="tel"
          required
          class="w-full border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
          id="phone"
          placeholder="+7 xxx-xxx-xx-xx"
          v-maska
          data-maska="+7 (###) ###-##-##"
          autocomplete="off"
          v-model="phone"
          autofocus
        />
        <p
          v-if="errorMessage"
          class="text-red-500 font-medium"
        >
          {{ errorMessage }}
        </p>
      </div>
      <div class="">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-start w-full place-content-center bg-green-600 px-5 py-3 text-white font-medium disabled:opacity-75"
        >
          <Loading v-if="loading" class="h-5 w-5" />
          Получить код
        </button>
      </div>
    </form>
  </div>
</template>
