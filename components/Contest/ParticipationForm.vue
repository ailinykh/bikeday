<script setup lang="ts">
import { IContest } from "~/types";
const props = defineProps<{
  errorMessage?: string;
  loading: boolean;
  contests: IContest[];
}>();

const contest = ref<IContest | null>(props.contests[0]);

defineEmits(["participation:submit"]);
</script>

<template>
  <h2 class="mb-6 text-center text-xl font-medium">
    Регистрация в конкурсах
  </h2>
  <div class="m-auto max-w-xs">
    <form
      @submit.prevent="
        () => $emit('participation:submit', contest)
      "
    >
      <div class="mb-6">
        <select
          class="w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
          aria-label="Выберите конкурс"
          v-model="contest"
        >
          <option
            v-for="c in contests"
            :key="c.id"
            :value="c"
          >
            {{ c.title }}
          </option>
        </select>
      </div>
      <div class="">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex w-full place-content-center items-start bg-green-600 px-5 py-3 font-medium text-white disabled:opacity-75"
        >
          <Loading v-if="loading" class="h-5 w-5" />
          Записаться на участие
        </button>
      </div>
    </form>
  </div>
</template>
