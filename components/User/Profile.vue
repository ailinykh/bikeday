<script setup lang="ts">
import { User } from "~/types";

const props = defineProps<{
  errorMessage?: string;
  loading: boolean;
  user: User;
}>();
const firstName = ref<string>(props.user.firstName);
const lastName = ref<string>(props.user.lastName);

defineEmits(["profile:update"]);
</script>

<template>
  <div class="max-w-xs m-auto">
    <h2 class="text-5xl text-center font-medium py-10">
      Анкета участника
    </h2>
    <form
      @submit.prevent="
        () =>
          $emit('profile:update', {
            id: user.id,
            firstName,
            lastName,
          })
      "
      class=""
    >
      <div class="mb-6">
        <label
          for="firstName"
          class="block text-sm leading-6 text-gray-900"
          >Имя</label
        >
        <input
          type="text"
          required
          class="w-full border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
          id="firstName"
          v-model="firstName"
        />
      </div>
      <div class="mb-6">
        <label
          for="lastName"
          class="block text-sm leading-6 text-gray-900"
          >Фамилия</label
        >
        <input
          type="text"
          required
          class="w-full border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-600"
          id="lastName"
          v-model="lastName"
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
          Сохранить
        </button>
      </div>
    </form>
  </div>
</template>
