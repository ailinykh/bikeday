<script setup lang="ts">
import { User, IParticipation } from "~/types";

const props = defineProps<{
  user: User;
  loading: boolean;
  message: string | null;
}>();

const paricipation = ref<IParticipation>(
  props.user.participation || {
    bike: "",
    district: "",
    band: "",
    bandBy: null,
  },
);

watch(
  () => props.user,
  (user) => {
    paricipation.value = user.participation || {
      bike: "",
      district: "",
      band: "",
      bandBy: null,
    };
  },
);

defineEmits(["user:submit"]);
</script>
<template>
  <div>
    <h2 class="mb-2 text-lg">
      <span class="font-medium">{{
        `${user.firstName} ${user.lastName}`
      }}</span>
      <span
        v-if="user.status != 'child'"
        class="mx-2 text-sm"
      >
        <Icon name="mdi:phone" class="" />
        {{ user.phone }}
      </span>
    </h2>
    <form
      class=""
      @submit.prevent="
        () => $emit('user:submit', user, paricipation)
      "
    >
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
          Сохранить
        </button>
        <p
          v-if="message"
          class="pl-4 font-medium text-green-800"
        >
          {{ message }}
        </p>
      </div>
    </form>
  </div>
</template>
