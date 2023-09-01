<script setup lang="ts">
import { IParticipation, User } from "~/types";

const props = defineProps<{
  participation: IParticipation;
  user: User;
}>();
</script>

<template>
  <div>
    <h2 class="text-5xl text-center font-medium py-10">
      Ура! Вы
      {{
        user.gender == "female" ? "участница" : "участник"
      }}
      Велодня 2023!
    </h2>
  </div>

  <div class="relative overflow-x-auto">
    <table
      class="max-w-xl mx-auto text-sm text-left text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Район</th>
          <th scope="col" class="px-6 py-3">Велосипед</th>
          <th scope="col" class="px-6 py-3">
            Номер браслета
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td class="px-6 py-4">
            {{ participation.district }}
          </td>
          <td class="px-6 py-4">
            {{ participation.bike }}
          </td>
          <td
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ participation.band ?? "пока неизвестен" }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="text-center py-12">
      Регистрация в конкурсах будет доступна чуть позже
    </p>
  </div>
</template>
