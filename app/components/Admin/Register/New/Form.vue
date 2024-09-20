<script setup lang="ts">
import type { User, IParticipation } from "~~/types";

const props = defineProps<{
  loading: boolean;
  errorMessage: string | null;
}>();

const user = ref<User>({
  id: 0,
  status: "user",
  firstName: "",
  lastName: "",
  phone: "",
  gender: null,
  birthday: null,
  participation: null,
});

const paricipation = ref<IParticipation>({
  bike: "",
  district: "",
  band: "",
  bandBy: null,
});

defineEmits(["user:submit"]);
</script>
<template>
  <div>
    <form
      class=""
      @submit.prevent="
        () => $emit('user:submit', user, paricipation)
      "
    >
      <div class="mb-6">
        <label
          for="firstName"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Имя</label
        >
        <input
          v-model="user.firstName"
          type="text"
          id="firstName"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          :disabled="loading"
          required
        />
      </div>
      <div class="mb-6">
        <label
          for="lastName"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Фамилия</label
        >
        <input
          v-model="user.lastName"
          type="text"
          id="lastName"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          :disabled="loading"
          required
        />
      </div>
      <div class="mb-6 flex items-start">
        <div class="flex h-5 items-center">
          <input
            id="remember"
            type="checkbox"
            value=""
            class="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
            @change="
              (e) =>
                (user.status = e.target.checked
                  ? 'child'
                  : 'user')
            "
          />
        </div>
        <label
          for="remember"
          class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Ребенок</label
        >
      </div>
      <div class="mb-6">
        <label
          for="lastName"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Телефон
          {{
            user.status == "child"
              ? "уже зарегистрированного родителя"
              : ""
          }}</label
        >
        <input
          v-model="user.phone"
          type="tel"
          id="phone"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          :disabled="loading"
          required
        />
      </div>
      <div class="mb-6">
        <label
          for="district"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Район</label
        >
        <select
          class="w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
          aria-label="Выберите район"
          v-model="paricipation.district"
        >
          <option>Северный</option>
          <option>Советский</option>
          <option>Железнодорожный</option>
          <option>Заводской</option>
          <option>Орловский</option>
          <option>Не Орловская область</option>
        </select>
      </div>
      <div class="mb-6">
        <label
          for="band"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Браслет</label
        >
        <input
          v-model="paricipation.band"
          type="tel"
          autocomplete="off"
          autocorrect="off"
          id="band"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          :disabled="loading"
          required
        />
      </div>
      <div class="flex items-center">
        <button
          type="submit"
          class="inline-flex w-full place-content-center items-start rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 disabled:opacity-75 dark:bg-green-600 dark:hover:bg-green-700 sm:w-auto"
          :disabled="loading"
        >
          <Loading v-if="loading" class="w-5" />
          Зарегистрировать
        </button>
        <p
          v-if="errorMessage"
          class="pl-4 font-medium text-red-800"
        >
          {{ errorMessage }}
        </p>
      </div>
    </form>
  </div>
</template>
