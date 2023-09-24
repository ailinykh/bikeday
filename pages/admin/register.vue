<script setup lang="ts">
useHead({
  title: "Рега",
});

definePageMeta({
  middleware: ["volunteer"],
});

const event = await useEvent();
const mode = ref<string>("new");
const changeMode = (to: string) => {
  mode.value = "reset";
  // hack to reset form state
  setTimeout(() => {
    mode.value = to;
  }, 10);
};
</script>

<template>
  <div>
    <div class="flex justify-center">
      <a
        href="#"
        aria-current="page"
        class="rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100 focus:z-10 focus:text-green-700 focus:ring-2 focus:ring-green-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-green-500"
        @click="changeMode('existing')"
        :class="{
          'text-green-700': mode == 'existing',
          'text-gray-900': mode != 'existing',
        }"
      >
        Есть регистрация
      </a>
      <a
        href="#"
        class="rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:text-green-700 focus:ring-2 focus:ring-green-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-green-500"
        @click="changeMode('new')"
        :class="{
          'text-green-700': mode == 'new',
          'text-gray-900': mode != 'new',
        }"
      >
        Новый участник
      </a>
    </div>
    <div class="my-6">
      <AdminRegisterExisting
        v-if="mode == 'existing'"
        :event="event"
      />
      <AdminRegisterNew
        v-if="mode == 'new'"
        :event="event"
      />
    </div>
  </div>
</template>
