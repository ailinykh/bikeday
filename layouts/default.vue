<template>
  <div class="bikeday-bg-white h-screen overflow-y-auto">
    <nav
      class="border-b border-gray-200 bg-white drop-shadow-md dark:bg-gray-900"
    >
      <div
        class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4"
      >
        <NuxtLink to="/" class="flex items-center">
          <span
            class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"
            >Велодень 2023</span
          >
        </NuxtLink>
        <button
          v-if="user"
          data-collapse-toggle="navbar-default"
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          class="hidden w-full md:block md:w-auto"
          id="navbar-default"
          v-if="user"
        >
          <ul
            class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900"
          >
            <li>
              <a
                href="/event"
                class="block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-green-700 md:dark:hover:bg-transparent md:dark:hover:text-green-500"
                >Велодень</a
              >
            </li>
            <li>
              <a
                href="/profile"
                class="block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-green-700 md:dark:hover:bg-transparent md:dark:hover:text-green-500"
                >Профиль</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-green-700 md:dark:hover:bg-transparent md:dark:hover:text-green-500"
                @click="logout"
                >Выйти</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container m-auto px-6 pt-8 lg:pt-14">
      <NuxtErrorBoundary>
        <slot />
        <template #error="{ error }">
          <p>{{ error }}</p>
        </template>
      </NuxtErrorBoundary>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { initFlowbite } from "flowbite";
import { useAuth } from "~/stores/auth";

const auth = useAuth();
const user = useState("user");

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
});

const logout = async () => {
  if (confirm("Вы действительно хотите выйти?")) {
    await auth.logout();
    user.value = null;
    navigateTo("/");
  }
};
</script>
