<script setup lang="ts">
useHead({
  title: "Конкурсы",
});

definePageMeta({
  middleware: ["volunteer"],
});

import { IContest } from "~/types";

const contests = await $fetch<IContest[]>(
  "/api/admin/contests",
  { headers: useRequestHeaders(["cookie"]) },
);
</script>

<template>
  <div>
    <div class="">
      <h2
        class="mb-3 text-center text-2xl font-medium text-gray-900 dark:text-white"
      >
        Конкурсы
      </h2>
      <table
        class="my-8 w-full text-left text-sm text-gray-500 dark:text-gray-400"
      >
        <tbody>
          <tr
            v-for="contest in contests"
            :key="contest.id"
            class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-2 py-2 font-medium text-gray-900 dark:text-white"
            >
              {{ contest.title }}
            </th>
            <td
              class="px-2 py-2 font-bold"
              :class="{
                'text-green-700':
                  contest.status == 'opened',
                'text-red-700': contest.status == 'closed',
              }"
            >
              {{
                contest.status == "opened"
                  ? "открыт"
                  : "закрыт"
              }}
            </td>
            <td class="px-2 py-2">
              <a :href="`/admin/contests/${contest.id}`">
                <Icon name="iconamoon:edit" class="mr-3" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
