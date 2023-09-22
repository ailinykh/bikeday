<script setup lang="ts">
useHead({
  title: "Профиль",
});

definePageMeta({
  middleware: ["auth"],
});

import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { User } from "~/types";
import { useUser } from "~/stores/user";

const user = useState<User>("user");
const userStore = useUser();
const updated = ref(false);

const state = reactive({
  firstName: user.value.firstName,
  lastName: user.value.lastName,
  birthday:
    user.value.birthday &&
    `${user.value.birthday.substring(
      8,
      10,
    )}.${user.value.birthday.substring(
      5,
      7,
    )}.${user.value.birthday.substring(0, 4)}`,
  gender: user.value.gender,
});

const rules = computed(() => ({
  firstName: { required },
  lastName: { required },
  birthday: { required },
  gender: { required },
}));

const v$ = useVuelidate(rules, state);

const submitProfile = async () => {
  updated.value = false;
  await v$.value.$validate();
  if (!v$.value.$error) {
    await userStore.update({ id: user.value.id, ...state });
    updated.value = true;
  }
};
</script>

<template>
  <div>
    <h2
      class="mb-3 text-2xl font-medium text-gray-900 dark:text-white"
    >
      Профиль
    </h2>
    <form @submit.prevent="submitProfile">
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
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          placeholder="Ваше имя"
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
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          placeholder="Ваша фамилия"
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
            datepicker
            datepicker-format="dd.mm.yyyy"
            type="text"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
            :class="{
              'border-gray-300': !v$.birthday.$invalid,
              'border-red-500': v$.birthday.$error,
            }"
            placeholder="Выберите дату"
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
          class="mb-2 block flex items-center text-sm font-medium text-gray-900 dark:text-white"
        >
          Ваш пол
          <span class="ml-2 text-xs text-gray-400">
            (нужен для оформления грамот)
          </span>
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
          v-if="updated"
          class="mt-2 text-sm font-medium text-green-600 dark:text-green-500"
        >
          Данные успешно обновлены
        </p>
      </div>
      <button
        type="submit"
        class="w-full rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 sm:w-auto"
      >
        Сохранить
      </button>
    </form>
  </div>
</template>
