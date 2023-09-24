<script setup lang="ts">
import { User } from "~/types";

const props = defineProps<{
  users: User[];
}>();

defineEmits(["user:edit"]);
</script>
<template>
  <div>
    <table
      class="my-8 w-full text-left text-sm text-gray-500 dark:text-gray-400"
    >
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-2 py-2 font-medium text-gray-900 dark:text-white"
          >
            {{ user.firstName + " " + user.lastName }}
            <p class="text-xs font-light">
              {{ user.phone }}
            </p>
          </th>
          <td class="px-2 py-2 font-bold">
            {{
              (user.participation &&
                user.participation.band) ||
              "нет браслета"
            }}
          </td>
          <td class="px-2 py-2">
            <button @click="$emit('user:edit', user)">
              <Icon name="iconamoon:edit" class="mr-3" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
