<script setup lang="ts">
// TODO: replace this form with `ProfileForm`
import type { User } from "~/types";

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
  <div class="m-auto max-w-xs">
    <h2 class="py-10 text-center text-5xl font-medium">
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
          class="w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
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
          class="w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
          id="lastName"
          v-model="lastName"
        />
        <p
          v-if="errorMessage"
          class="font-medium text-red-500"
        >
          {{ errorMessage }}
        </p>
      </div>
      <div class="">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex w-full place-content-center items-start bg-green-600 px-5 py-3 font-medium text-white disabled:opacity-75"
        >
          <Loading v-if="loading" class="h-5 w-5" />
          Сохранить
        </button>
      </div>
    </form>
  </div>
</template>
