<script setup lang="ts">
import { IEvent, IParticipation, User } from "~/types";

const props = defineProps<{
  event: IEvent;
}>();

const loading = ref<boolean>(false);
const message = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const onSubmit = async (u: User, p: IParticipation) => {
  loading.value = true;
  errorMessage.value = null;

  const { error, data } = await useFetch<{
    user: User;
    participation: IParticipation;
  }>(`/api/admin/event/${props.event.id}/participation`, {
    method: "POST",
    body: { ...u, ...p },
  });

  if (error.value) {
    errorMessage.value =
      error.value.statusMessage ??
      "Произошла неизвестная ошибка";
  } else {
    const { user, participation } = data.value!;
    message.value = `${user.firstName} ${user.lastName} успешно зарегистрирован. Номер браслета: ${participation.band}`;
  }

  loading.value = false;
};

const onReset = () => {
  message.value = null;
};
</script>

<template>
  <div>
    <div v-if="message">
      <p class="my-4 font-bold">
        {{ message }}
      </p>
      <button
        class="inline-flex w-full place-content-center items-start rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 disabled:opacity-75 dark:bg-green-600 dark:hover:bg-green-700 sm:w-auto"
        @click="onReset"
      >
        Продолжить
      </button>
    </div>
    <AdminRegisterNewForm
      v-else
      :loading="loading"
      :errorMessage="errorMessage"
      @user:submit="onSubmit"
    />
  </div>
</template>
