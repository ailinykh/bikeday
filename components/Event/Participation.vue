<script setup lang="ts">
import { IParticipation, User } from "~/types";

const props = defineProps<{
  participation: IParticipation;
  user: User;
  children: User[];
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
    <div v-if="props.children.length > 0">
      <h2 class="py-10 text-center text-2xl font-medium">
        Дети
      </h2>
      <table
        class="mx-auto max-w-xl text-left text-sm text-gray-500 dark:text-gray-400"
      >
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Ребенок</th>
            <th scope="col" class="px-6 py-3">
              Номер браслета
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            v-for="child in children"
            :key="child.id"
          >
            <td class="px-6 py-4">
              {{ child.firstName + " " + child.lastName }}
            </td>
            <td
              class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              {{
                (child.participation &&
                  child.participation.band) ??
                "пока неизвестен"
              }}
            </td>
            <!-- <td class="px-6 py-4">
              <button
                type="button"
                class="font-medium text-green-800"
                data-modal-target="child-participation-modal"
                data-modal-toggle="child-participation-modal"
                v-if="!child.participation"
              >
                Указать браслет
              </button>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
