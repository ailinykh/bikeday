<script setup lang="ts">
import type { IContest } from "~/types";
const props = defineProps<{
  contests: IContest[];
}>();

const loading = ref<boolean>(false);

const participated = computed(() =>
  props.contests.filter(
    (contest) => contest.participation != null,
  ),
);

const notParticipated = computed(() =>
  props.contests.filter(
    (contest) =>
      contest.participation == null &&
      contest.status == "opened",
  ),
);

defineEmits([
  "participation:submit",
  "participation:cancel",
]);
</script>

<template>
  <div class="my-8">
    <h2 class="py-4 text-center text-2xl font-medium">
      Конкурсы
    </h2>
    <table
      v-if="participated.length > 0"
      class="my-4 w-full text-left text-sm text-gray-500 dark:text-gray-400"
    >
      <tbody>
        <tr
          v-for="contest in participated"
          :key="contest.id"
          class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-2 py-2 font-medium text-gray-900 dark:text-white"
          >
            {{ contest.title }}
          </th>
          <td class="px-2 py-2">
            <button
              type="button"
              class="text-grey-600 font-medium"
              @click="
                $emit('participation:cancel', contest)
              "
            >
              <Icon
                name="material-symbols:cancel"
                class="mr-1"
              />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <ContestParticipationForm
      v-if="notParticipated.length > 0"
      :contests="notParticipated"
      :loading="loading"
      @participation:submit="
        (contest) => $emit('participation:submit', contest)
      "
    />
  </div>
</template>
