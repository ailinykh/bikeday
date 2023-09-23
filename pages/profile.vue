<script setup lang="ts">
useHead({
  title: "Профиль",
});

definePageMeta({
  middleware: ["auth"],
});

import { User } from "~/types";
import { useUser } from "~/stores/user";

const user = useState<User>("user");
const userStore = useUser();

const loading = ref(false);
const errorMessage = ref<string | undefined>();
const successMessage = ref<string | undefined>();

const submitProfile = async (data: User) => {
  loading.value = true;
  successMessage.value = undefined;
  errorMessage.value = undefined;

  try {
    await userStore.update({
      ...data,
      id: user.value.id,
    });
    successMessage.value = "Данные успешно обновлены";
  } catch (error) {
    errorMessage.value = error;
    successMessage.value = undefined;
  }

  loading.value = false;
};
</script>

<template>
  <div>
    <h2
      class="mb-3 text-2xl font-medium text-gray-900 dark:text-white"
    >
      Профиль
    </h2>
    <UserProfileForm
      :user="user"
      :loading="loading"
      :successMessage="successMessage"
      :errorMessage="errorMessage"
      @form:submit="submitProfile"
    />
  </div>
</template>
