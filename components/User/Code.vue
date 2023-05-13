<script setup lang="ts">
import { AuthRequest } from "~/types/user";

const props = defineProps<{
  authRequest: AuthRequest;
  errorMessage?: string;
  loading: boolean;
}>();

const code = ref("");
const countdown = ref("00:02:00");

defineEmits(["login:code", "login:retry"]);

const updateCountdown = () => {
  const now = new Date();
  const created = new Date(props.authRequest.createdAt);
  const diff = now.getTime() - created.getTime();
  const timeout = 120 - Math.ceil(diff / 1000);
  if (timeout > 0) {
    const minutes = Math.floor(timeout / 60);
    const seconds = timeout % 60;
    countdown.value = `00:0${minutes}:${
      seconds > 9 ? "" : "0"
    }${seconds}`;
    setTimeout(updateCountdown, 1000);
  } else {
    countdown.value = "";
  }
};

onMounted(() => {
  document.getElementById("code")?.focus();
  updateCountdown();
});

watch(
  () => props.authRequest,
  () => {
    code.value = "";
    document.getElementById("code")?.focus();
    updateCountdown();
  }
);
</script>

<template>
  <div class="w-80 m-auto">
    <h2 class="text-5xl text-center font-medium py-10">
      Вход
    </h2>
    <form
      @submit.prevent="
        () =>
          $emit(
            'login:code',
            code,
            props.authRequest.context
          )
      "
      class=""
    >
      <div class="mb-6">
        <label
          for="code"
          class="block text-sm leading-6 text-gray-900"
          >Код подтверждения</label
        >
        <input
          type="tel"
          required
          class="w-full border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
          id="code"
          v-maska
          data-maska="######"
          autocomplete="off"
          v-model="code"
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
          Отправить код
        </button>
      </div>
    </form>
    <div class="my-4">
      <p class="text-center" v-if="countdown.length">
        запросить код повторно можно через {{ countdown }}
      </p>
      <button
        v-else
        class="inline-flex items-start w-full place-content-center bg-gray-600 px-5 py-3 text-white font-medium disabled:opacity-75"
        :disabled="loading"
        @click="
          () => $emit('login:retry', authRequest.context)
        "
      >
        <Loading v-if="loading" class="h-5 w-5" />
        Запросить код еще раз
      </button>
    </div>
  </div>
</template>
