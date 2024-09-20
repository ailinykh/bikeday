<script setup lang="ts">
useHead({
  title: "Профиль",
});

definePageMeta({
  middleware: ["auth"],
});

import type { User, UserProfileFull } from "~~/types";

async function useProfile(id: Number) {
  const isLoading = ref(false);
  const isError = ref(false);
  const message = ref("");

  const { data: profile } = await useFetch<UserProfileFull>(
    `/api/user/${id}`,
  );

  const updateProfile = async (
    profile: UserProfileFull,
  ) => {
    isLoading.value = true;

    try {
      await $fetch<User>(`/api/user/${id}`, {
        method: "PUT",
        body: profile,
      });
      isError.value = false;
      message.value = "Данные успешно обновлены";
    } catch (e) {
      isError.value = true;
      message.value = `${e}`;
    }
    isLoading.value = false;
  };

  return {
    profile,
    updateProfile,
    isLoading,
    isError,
    message,
  };
}

const { id } = useState<User>("user").value;
const {
  profile,
  updateProfile,
  isLoading,
  isError,
  message,
} = await useProfile(id);
</script>

<template>
  <div>
    <h2
      class="mb-3 text-2xl font-medium text-gray-900 dark:text-white"
    >
      Профиль
    </h2>
    <UserProfileForm
      :profile="profile!"
      :loading="isLoading"
      :message="message"
      :error="isError"
      :showDelete="false"
      @form:submit="updateProfile"
    />
    <a
      href="/children"
      class="link mt-10 block font-medium text-green-600 dark:text-green-500"
      >Добавить ребёнка</a
    >
  </div>
</template>
