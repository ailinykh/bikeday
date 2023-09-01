<script setup lang="ts">
import { IParticipation, User } from "~/types";

const props = defineProps<{
  participation: IParticipation;
  user: User;
}>();
</script>

<template>
  <div>
    <h2 class="py-10 text-center text-5xl font-medium">
      Ура! Вы
      {{
        user.gender == "female" ? "участница" : "участник"
      }}
      Велодня 2023!
    </h2>
  </div>

  <div class="relative overflow-x-auto">
    <table
      class="mx-auto max-w-xl text-left text-sm text-gray-500 dark:text-gray-400"
    >
      <thead
        class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
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
          class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <td class="px-6 py-4">
            {{ participation.district }}
          </td>
          <td class="px-6 py-4">
            {{ participation.bike }}
          </td>
          <td
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
          >
            {{ participation.band ?? "пока неизвестен" }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="py-12 text-center">
      Регистрация в конкурсах будет доступна чуть позже
    </p>
  </div>
</template>
