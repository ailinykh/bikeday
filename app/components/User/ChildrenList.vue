<script setup lang="ts">
import type { PropType } from "vue";
import type { User } from "~~/types";

const props = defineProps({
  children: Object as PropType<Array<User>>,
});

defineEmits(["child:edit"]);

function calculateAge(birthday: string) {
  const date = new Date(birthday),
    now = new Date(),
    timeDifference = Math.abs(
      date.getTime() - now.getTime(),
    );

  const years = Math.ceil(
    timeDifference / (1000 * 3600 * 24 * 365) - 1,
  );
  if (years % 10 == 1) return "1 год";
  if (years % 10 > 1 && years % 10 < 5)
    return `${years} года`;
  return `${years} лет`;
}
</script>

<template>
  <div class="relative overflow-x-auto">
    <table
      class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
      v-if="children && children.length > 0"
    >
      <tbody>
        <tr
          v-for="child in children"
          :key="child.id"
          class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
          >
            {{ child.firstName + " " + child.lastName }}
          </th>
          <td class="px-6 py-4">
            {{ calculateAge(child.birthday!) }}
          </td>
          <td v-if="child.gender" class="px-6 py-4">
            {{
              child.gender == "male" ? "мальчик" : "девочка"
            }}
          </td>
          <td v-else class="px-6 py-4">пол неизвестен</td>
          <td class="px-6 py-4">
            <button @click="$emit('child:edit', child)">
              <Icon name="iconamoon:edit" class="mr-3" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="">У вас пока нет детей</div>
  </div>
</template>
