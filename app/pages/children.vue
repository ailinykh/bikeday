<script setup lang="ts">
useHead({
  title: "Профиль",
});

definePageMeta({
  middleware: ["auth"],
});

const reloadChildren = async () => {
  const data = await $fetch<User[]>(`/api/children`);
  if (data) {
    children.value = data;
  }
};

onMounted(reloadChildren);

import type { User, UserProfileFull } from "~~/types";

const children = ref<User[]>([]);

const empty = ref<UserProfileFull>({
  id: null,
  firstName: "",
  lastName: "",
  birthday: "",
  gender: "",
});

const loading = ref(false);
const errorMessage = ref<string | undefined>();
const successMessage = ref<string | undefined>();

const submitChild = async (data: User) => {
  loading.value = true;
  successMessage.value = undefined;
  errorMessage.value = undefined;

  const { error } = await useFetch<User>(`/api/children/`, {
    body: data,
    method: data.id ? "PUT" : "POST",
  });

  if (error.value) {
    errorMessage.value = error.value.message;
    successMessage.value = undefined;
  } else {
    errorMessage.value = undefined;
    successMessage.value = data.id
      ? "Данные успешно обновлены"
      : "Ребенок добавлен";
  }

  await reloadChildren();
  loading.value = false;
};

const onChildEdit = (child: UserProfileFull) => {
  empty.value = child;
};

const deleteChild = async (data: User) => {
  const { error } = await useFetch<User>(`/api/children/`, {
    body: { id: data.id },
    method: "DELETE",
  });

  if (error.value) {
    errorMessage.value = error.value.message;
    successMessage.value = undefined;
  } else {
    errorMessage.value = undefined;
    successMessage.value = "Ребенок удалён";

    empty.value = {
      id: null,
      firstName: "",
      lastName: "",
      birthday: "",
      gender: "",
    };
    reloadChildren();
  }
};
</script>

<template>
  <div>
    <h2
      class="mb-3 text-2xl font-medium text-gray-900 dark:text-white"
    >
      Дети
    </h2>
    <UserChildrenList
      :children="children"
      @child:edit="onChildEdit"
    />
    <div v-if="children.length < 5 || empty.id">
      <h3
        class="mb-3 mt-8 text-2xl font-medium text-gray-900 dark:text-white"
      >
        {{ empty.id ? "Изменить" : "Добавить" }} ребенка
      </h3>
      <UserProfileForm
        :profile="empty"
        :loading="loading"
        :successMessage="successMessage"
        :errorMessage="errorMessage"
        :showDelete="empty.id != null"
        @form:submit="submitChild"
        @form:delete="deleteChild"
      />
    </div>
  </div>
</template>
