<script setup lang="ts">
useHead({
  title: "Сертификат участника",
});

definePageMeta({
  middleware: ["auth"],
});

import { User } from "~/types";

const user = useState<User>("user");
</script>

<template>
  <div class="text-center">
    <h2 class="py-10 text-5xl font-medium">
      Сертификат участника
    </h2>
    <a
      class="place-content-center items-start rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 disabled:opacity-75 dark:bg-green-600 dark:hover:bg-green-700 sm:w-auto"
      :href="`https://cert.bikeday.me/2023?name=${user.firstName}%20${user.lastName}`"
      >Скачать сертификат</a
    >
    <p class="mt-8">
      Вы всегда можете изменить ваше имя в
      <a href="/profile" class="font-medium text-green-500"
        >профиле</a
      >
    </p>
  </div>
</template>
