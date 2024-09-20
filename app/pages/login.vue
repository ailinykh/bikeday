<script setup lang="ts">
useHead({
  title: "Вход",
});

import { storeToRefs } from "pinia";
import { useAuth } from "~/stores/auth";
import type { TelegramAuthRequest } from "~~/types";

const telegram = ref<TelegramAuthRequest | undefined>();
const auth = useAuth();
const { authRequest, loading, errorMessage } =
  storeToRefs(auth);

const user = useState("user");

if (user.value) {
  navigateTo(`/event`);
}

const { data } = await useFetch<TelegramAuthRequest>(
  "/api/telegram/login",
);
if (data.value) {
  telegram.value = data.value;
}
</script>

<template>
  <div>
    <UserCode
      v-if="authRequest"
      :loading="loading"
      :errorMessage="errorMessage"
      :authRequest="authRequest"
      @login:code="auth.confirm"
      @login:retry="auth.login"
    />
    <UserLogin
      v-else
      :loading="loading"
      :errorMessage="errorMessage"
      :telegram="telegram"
      @login:phone="auth.login"
    />
  </div>
</template>
