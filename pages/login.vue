<script setup lang="ts">
useHead({
  title: "Вход",
});

import { storeToRefs } from "pinia";
import { useAuth } from "~/stores/auth";

const telegramLoginUrl = ref<string | undefined>();
const auth = useAuth();
const { authRequest, loading, errorMessage } =
  storeToRefs(auth);

const user = useState("user");

if (user.value) {
  navigateTo(`/event`);
}

const { data } = await useFetch("/api/telegram/loginUrl");
if (data.value) {
  telegramLoginUrl.value = data.value.url;
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
      :telegramLoginUrl="telegramLoginUrl"
      @login:phone="auth.login"
    />
  </div>
</template>
