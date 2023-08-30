<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuth } from "~/stores/auth";

definePageMeta({
  middleware: ["auth"],
});

const logout = async () => {
  if (confirm("Вы действительно хотите выйти?")) {
    await auth.logout();
    navigateTo("/");
  }
};

const auth = useAuth();
const { user } = storeToRefs(auth);
auth.initialize();
</script>
<template>
  <div class="bikeday-bg-white h-screen">
    <h1>Welcome to bikeday, {{ user?.firstName }}!</h1>
    <button
      class="inline-flex items-start w-full place-content-center bg-green-600 py-3 text-white font-medium disabled:opacity-75"
      @click="logout"
    >
      Выйти
    </button>
  </div>
</template>
