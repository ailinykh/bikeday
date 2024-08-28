<script setup lang="ts">
useHead({
  title: "Сертификат участника",
});

definePageMeta({
  middleware: ["auth"],
});

import { storeToRefs } from "pinia";
import type { User } from "~/types";
import { useParticipation } from "~/stores/participation";

const user = useState<User>("user");
const config = useRuntimeConfig();

// Participation
const event = await useEvent();
const participationStore = useParticipation();
const { band } = storeToRefs(participationStore);
await participationStore.initialize(event.id);

// children
const children = ref<User[]>(
  // TODO: respect children participation
  await $fetch<User[]>(`/api/children`, {
    headers: useRequestHeaders(["cookie"]),
  }),
);
</script>

<template>
  <div class="text-center">
    <h2 class="py-10 text-5xl font-medium">
      Сертификат участника
    </h2>
    <a
      v-if="band"
      class="place-content-center items-start rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 disabled:opacity-75 dark:bg-green-600 dark:hover:bg-green-700 sm:w-auto"
      :href="`https://cert.bikeday.me/2023?name=${user.firstName}%20${user.lastName}`"
      >Скачать сертификат</a
    >
    <p v-else>
      К сожалению, мы не смогли найти номер вашего браслета
      в карточке участника. Если браслет всё еще у вас,
      напишите
      <a
        :href="`tg://resolve?domain=${config.public.telegram.botUsername}`"
        class="font-medium text-green-500"
        >в поддержку</a
      >.
    </p>
    <p class="my-8">
      Вы всегда можете изменить ваше имя в
      <a href="/profile" class="font-medium text-green-500"
        >профиле</a
      >
    </p>
    <p v-if="children.length > 0">
      Сертификаты детей:
      <a
        v-for="user in children"
        :key="user.id"
        class="px-5 text-center font-medium text-green-800"
        :href="`https://cert.bikeday.me/2023?name=${user.firstName}%20${user.lastName}`"
        >{{ user.firstName + " " + user.lastName }}</a
      >
    </p>
  </div>
</template>
