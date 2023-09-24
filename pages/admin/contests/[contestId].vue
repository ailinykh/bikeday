<script setup lang="ts">
useHead({
  title: "Конкурсы",
});

definePageMeta({
  middleware: ["volunteer"],
});

import { IContest } from "~/types";

const loading = ref<boolean>(false);
const { params } = useRoute();
const contest = ref<IContest>(
  await $fetch<IContest>(
    `/api/admin/contests/${params.contestId}`,
    { headers: useRequestHeaders(["cookie"]) },
  ),
);

const onButtonCliked = async () => {
  contest.value = await $fetch<IContest>(
    `/api/admin/contests/${params.contestId}`,
    {
      method: "PUT",
      body: {
        status:
          contest.value.status == "opened"
            ? "closed"
            : "opened",
      },
    },
  );
};
</script>

<template>
  <div>
    <div>
      <h2
        class="mb-3 text-center text-2xl font-medium text-gray-900 dark:text-white"
      >
        {{ contest.title }}
      </h2>
      <div class="flex justify-between">
        <p>
          Регистрация на участие
          <span
            class="font-bold"
            :class="{
              'text-green-700': contest.status == 'opened',
              'text-red-700': contest.status == 'closed',
            }"
          >
            {{
              contest.status == "opened"
                ? "открыта"
                : "закрыта"
            }}</span
          >
        </p>
        <button
          type="button"
          class="inline-flex w-full place-content-center items-start rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white disabled:opacity-75 dark:bg-green-600 sm:w-auto"
          :class="{
            'bg-red-700': contest.status == 'opened',
            'hover:bg-red-800': contest.status == 'opened',
            'dark:hover:bg-red-700':
              contest.status == 'opened',
            'bg-green-700': contest.status == 'closed',
            'hover:bg-green-800':
              contest.status == 'closed',
            'dark:hover:bg-green-700':
              contest.status == 'closed',
          }"
          :disabled="loading"
          @click="onButtonCliked"
        >
          <Loading v-if="loading" class="w-5" />
          {{
            contest.status == "opened"
              ? "Закрыть"
              : "Открыть"
          }}
        </button>
      </div>
    </div>
  </div>
</template>
