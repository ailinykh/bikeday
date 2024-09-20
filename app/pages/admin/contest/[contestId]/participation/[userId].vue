<script setup lang="ts">
useHead({
  title: "Конкурсы",
});

definePageMeta({
  middleware: ["volunteer"],
});

import type {
  IContest,
  IContestParticipation,
  User,
} from "~~/types";

type ContestParticipation = IContestParticipation & {
  user: User;
  contest: IContest;
};

const event = await useEvent();
const { params } = useRoute();
const participation = ref<ContestParticipation>(
  await $fetch<ContestParticipation>(
    `/api/admin/contests/participation?contestId=${params.contestId}&userId=${params.userId}&eventId=${event.id}`,
    { headers: useRequestHeaders(["cookie"]) },
  ),
);

const onSubmit = async () => {
  const { contestId, userId } = params;
  await $fetch(`/api/admin/contests/participation`, {
    method: "POST",
    body: {
      contestId,
      userId,
      eventId: event.id,
      score: participation.value.score,
    },
  });
  navigateTo(`/admin/contests/${contestId}`);
};
</script>

<template>
  <div>
    <form class="" @submit.prevent="onSubmit">
      <div class="mb-6">
        <label
          for="firstName"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Результат для
          <span class="font-bold">
            {{
              participation.user.firstName +
              " " +
              participation.user.lastName
            }}
          </span>
          в конкурсе
          <span class="font-bold">
            {{ participation.contest.title }}
          </span></label
        >
        <input
          v-model="participation.score"
          type="text"
          id="firstName"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
        />
      </div>
      <div class="flex items-center">
        <button
          type="submit"
          class="inline-flex w-full place-content-center items-start rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 disabled:opacity-75 dark:bg-green-600 dark:hover:bg-green-700 sm:w-auto"
        >
          Сохранить
        </button>
      </div>
    </form>
  </div>
</template>
