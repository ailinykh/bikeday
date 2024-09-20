<script setup lang="ts">
import type {
  IEvent,
  User,
  IParticipation,
} from "~~/types";

const props = defineProps<{
  event: IEvent;
}>();

const searchInput = ref();
const users = ref<User[] | null>(null);
const loading = ref<boolean>(false);
const selectedUser = ref<User | null>(null);
const message = ref<string | null>(null);

onMounted(() => {
  searchInput.value.focus();
});

const onSearch = async (phone: string) => {
  message.value = null;
  loading.value = true;
  users.value = null;
  const result = await $fetch<User[]>(
    `/api/admin/search?phone=${phone}`,
  );
  if (result.length == 1) {
    selectedUser.value = result[0];
  } else {
    users.value = result;
    selectedUser.value = null;
  }
  loading.value = false;
};

const onSubmit = async (
  user: User,
  participation: IParticipation,
) => {
  message.value = null;
  loading.value = true;
  await $fetch<IParticipation>(
    `/api/admin/event/${props.event.id}/user/${user.id}`,
    { body: participation, method: "POST" },
  );
  loading.value = false;
  message.value = "Данные успешно изменены";
};
</script>

<template>
  <div>
    <form
      class="my-6 flex items-center"
      @submit.prevent="() => onSearch(searchInput.value)"
    >
      <div class="relative w-full">
        <!-- <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center px-3"
          @click="() => (searchInput.value = '')"
        >
          <Icon name="pajamas:clear" />
        </button> -->
        <input
          ref="searchInput"
          type="tel"
          autocomplete="off"
          autocorrect="off"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          placeholder="4 последние цифры номера телефона"
          :disabled="loading"
          required
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="ml-2 rounded-lg border border-green-700 bg-green-700 p-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-75 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        <svg
          class="h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </button>
    </form>
    <div v-if="users">
      <AdminRegisterExistingList
        v-if="users.length > 0"
        :users="users"
        @user:edit="
          (u) => {
            selectedUser = u;
          }
        "
      />
      <p v-else class="text-sm font-medium">
        Ничего не найдено
      </p>
    </div>
    <AdminRegisterExistingForm
      v-if="selectedUser"
      :user="selectedUser"
      :loading="loading"
      :message="message"
      @user:submit="onSubmit"
    />
  </div>
</template>
