<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    defaultValue: false,
  },
  errorMessage: String,
  telegramLoginUrl: String,
});

defineEmits(["login:phone"]);

const phone = ref("");
</script>

<template>
  <div class="m-auto max-w-xs">
    <h2 class="py-10 text-center text-5xl font-medium">
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
          class="w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
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
          class="font-medium text-red-500"
        >
          {{ errorMessage }}
        </p>
      </div>
      <div class="my-4">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex w-full place-content-center items-start bg-green-600 py-3 font-medium text-white disabled:opacity-75"
        >
          <Loading v-if="loading" class="h-5 w-5" />
          Получить код
        </button>
      </div>
      <div v-if="telegramLoginUrl">
        <p class="text-center">либо другим способом</p>
        <div class="my-4">
          <NuxtLink
            type="button"
            :disabled="loading"
            :to="telegramLoginUrl"
            class="inline-flex w-full place-content-center items-center bg-blue-400 py-3 font-medium text-white disabled:opacity-75"
          >
            <i
              ><font-awesome-icon
                class="px-3"
                icon="fa-brands fa-telegram"
            /></i>
            Войти через Telegram
          </NuxtLink>
        </div>
      </div>
    </form>
  </div>
</template>
