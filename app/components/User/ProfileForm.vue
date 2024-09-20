<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import type { UserProfileFull } from "~~/types";

const props = defineProps<{
  message?: string;
  error: boolean;
  loading: boolean;
  profile: UserProfileFull;
  showDelete: boolean;
}>();

const calculateBirthDate = (birthday: string): string =>
  `${birthday.substring(8, 10)}.${birthday.substring(
    5,
    7,
  )}.${birthday.substring(0, 4)}`;

let state = reactive({
  id: props.profile.id,
  firstName: props.profile.firstName,
  lastName: props.profile.lastName,
  birthday:
    props.profile.birthday &&
    calculateBirthDate(props.profile.birthday),
  gender: props.profile.gender,
});

watch(
  () => props.profile,
  (user) => {
    state.id = user.id;
    state.firstName = user.firstName;
    state.lastName = user.lastName;
    state.gender = user.gender;

    if (user.birthday) {
      state.birthday = calculateBirthDate(user.birthday);
    }
  },
);

const rules = computed(() => ({
  firstName: { required },
  lastName: { required },
  birthday: { required },
  gender: { required },
}));

const v$ = useVuelidate(rules, state);

const emit = defineEmits(["form:submit", "form:delete"]);

const onSubmit = async () => {
  await v$.value.$validate();
  if (!v$.value.$error) {
    emit("form:submit", state);
  }
};

const onDelete = () => {
  if (confirm("Вы уверены?")) {
    emit("form:delete", state);
  }
};
</script>

<template>
  <div class="pb-4">
    <form @submit.prevent="onSubmit">
      <div class="mb-6">
        <label
          for="firstName"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Имя</label
        >
        <input
          v-model="state.firstName"
          type="text"
          id="firstName"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          :disabled="loading"
          required
        />
        <span
          v-for="error in v$.firstName.$errors"
          :key="String(error.$uid)"
        >
          <p
            class="mt-2 text-sm font-medium text-red-600 dark:text-red-500"
          >
            {{
              error.$message == "Value is required"
                ? "Обязательное поле"
                : error.$message
            }}
          </p>
        </span>
      </div>
      <div class="mb-6">
        <label
          for="lastName"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Фамилия</label
        >
        <input
          v-model="state.lastName"
          type="text"
          id="lastName"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          :disabled="loading"
          required
        />
        <span
          v-for="error in v$.lastName.$errors"
          :key="String(error.$uid)"
        >
          <p
            class="mt-2 text-sm font-medium text-red-600 dark:text-red-500"
          >
            {{
              error.$message == "Value is required"
                ? "Обязательное поле"
                : error.$message
            }}
          </p>
        </span>
      </div>
      <div class="mb-6">
        <label
          for="birthday"
          class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >Дата рождения</label
        >
        <div class="relative max-w-sm">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"
          >
            <svg
              class="h-4 w-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
              />
            </svg>
          </div>
          <input
            v-model="state.birthday"
            id="datepicker"
            datepicker
            datepicker-format="dd.mm.yyyy"
            type="text"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
            :class="{
              'border-gray-300': !v$.birthday.$invalid,
              'border-red-500': v$.birthday.$error,
            }"
            placeholder="Выберите дату"
            :disabled="loading"
            required
            readonly
            @focusout="
              (event) =>
                (state.birthday = event.target?.value)
            "
          />
        </div>
        <span
          v-for="error in v$.birthday.$errors"
          :key="String(error.$uid)"
        >
          <p
            class="mt-2 text-sm font-medium text-red-600 dark:text-red-500"
          >
            {{
              error.$message == "Value is required"
                ? "Обязательное поле"
                : error.$message
            }}
          </p>
        </span>
      </div>
      <div class="mb-6">
        <label
          for="gender"
          class="mb-2 flex items-center text-sm font-medium text-gray-900 dark:text-white"
        >
          Пол
        </label>
        <fieldset>
          <div class="flex items-center">
            <div class="mb-4 mr-4 flex items-center">
              <input
                id="gender-option-1"
                type="radio"
                name="gender"
                value="male"
                v-model="state.gender"
                class="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-green-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:bg-green-600 dark:focus:ring-green-600"
                checked
              />
              <label
                for="gender-option-1"
                class="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Мужской
              </label>
            </div>

            <div class="mb-4 flex items-center">
              <input
                id="gender-option-2"
                type="radio"
                name="gender"
                value="female"
                v-model="state.gender"
                class="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-green-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:bg-green-600 dark:focus:ring-green-600"
              />
              <label
                for="gender-option-2"
                class="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Женский
              </label>
            </div>
          </div>
        </fieldset>
        <span
          v-for="error in v$.gender.$errors"
          :key="String(error.$uid)"
        >
          <p
            class="mt-2 text-sm font-medium text-red-600 dark:text-red-500"
          >
            {{
              error.$message == "Value is required"
                ? "Обязательное поле"
                : error.$message
            }}
          </p>
        </span>
        <p
          v-if="props.message"
          class="mt-2 text-sm font-medium"
          :class="`text-${error ? 'red' : 'green'}-600 dark:text-${error ? 'red' : 'green'}-500`"
        >
          {{ props.message }}
        </p>
      </div>
      <div class="flex justify-between">
        <button
          type="submit"
          class="inline-flex w-full place-content-center items-start rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 disabled:opacity-75 dark:bg-green-600 dark:hover:bg-green-700 sm:w-auto"
          :disabled="loading"
        >
          <Loading v-if="loading" class="w-5" />
          Сохранить
        </button>
        <button
          v-if="props.showDelete"
          type="button"
          @click="onDelete"
          class="inline-flex w-full place-content-center items-start rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 disabled:opacity-75 dark:bg-red-600 dark:hover:bg-red-700 sm:w-auto"
        >
          Удалить
        </button>
      </div>
    </form>
  </div>
</template>
