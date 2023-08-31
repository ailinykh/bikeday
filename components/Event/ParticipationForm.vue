<script setup lang="ts">
const props = defineProps<{
  errorMessage?: string;
  loading: boolean;
  eventId: number;
}>();

const bike = ref("");
const district = ref("Северный");

defineEmits(["participation"]);
</script>

<template>
  <h2 class="text-5xl text-center font-medium py-10">
    Анкета участника
  </h2>
  <div class="max-w-xs m-auto">
    <form
      @submit.prevent="
        () =>
          $emit('participation', {
            eventId,
            bike,
            district,
          })
      "
      class=""
    >
      <div class="mb-6">
        <label
          for="district"
          class="block text-sm leading-6 text-gray-900"
          >Район</label
        >
        <select
          class="w-full border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
          aria-label="Выберите район"
          v-model="district"
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
          for="bike"
          class="block text-sm leading-6 text-gray-900"
          >Модель велосипеда</label
        >
        <input
          type="text"
          required
          class="w-full border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
          id="bike"
          v-model="bike"
        />
        <p
          v-if="errorMessage"
          class="text-red-500 font-medium"
        >
          {{ errorMessage }}
        </p>
      </div>
      <div class="">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-start w-full place-content-center bg-green-600 px-5 py-3 text-white font-medium disabled:opacity-75"
        >
          <Loading v-if="loading" class="h-5 w-5" />
          Отправить
        </button>
      </div>
    </form>
  </div>
</template>
