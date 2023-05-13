<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuth } from "~/stores/auth";

const auth = useAuth();
const { authRequest, loading, errorMessage } =
  storeToRefs(auth);
</script>

<template>
  <div class="bikeday-bg-white h-screen">
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
      @login:phone="auth.login"
    />
  </div>
</template>
