<script setup lang="ts">
import type { PropType } from "vue";
import type { TelegramAuthRequest } from "~/types";

const props = defineProps({
  loading: {
    type: Boolean,
    defaultValue: false,
  },
  errorMessage: String,
  telegram: Object as PropType<TelegramAuthRequest>,
});

defineEmits(["login:phone"]);

const phone = ref("");

const telegramLogin = async () => {
  const { telegram } = props;
  if (!telegram) {
    return;
  }

  navigateTo(telegram.url, { external: true });
  setTimeout(async () => {
    await checkStatus(telegram.payload);
  }, 5000);
};

const checkStatus = async (payload: string) => {
  const { error } = await useFetch(
    `/api/session/authorize?payload=${payload}&redirect=false`,
  );

  if (error.value) {
    console.log(`❌ ${error.value.statusMessage}`);
    setTimeout(async () => {
      await checkStatus(payload);
    }, 1000);
  } else {
    window.location.href = "/event"; // hack to update navigation menu items
  }
};
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
      <div v-if="telegram">
        <p class="text-center">либо другим способом</p>
        <div class="my-4">
          <button
            type="button"
            :onClick="telegramLogin"
            :disabled="loading"
            class="inline-flex w-full place-content-center items-center bg-blue-400 py-3 font-medium text-white disabled:opacity-75"
          >
            <Icon name="fa6-brands:telegram" class="mr-3" />
            Войти через Telegram
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
