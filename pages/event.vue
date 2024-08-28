<script setup lang="ts">
useHead({
  title: "Регистрация",
});

definePageMeta({
  middleware: ["auth"],
});

import { storeToRefs } from "pinia";
import type {
  IContest,
  User,
  UserProfileFull,
} from "~/types";
import { useParticipation } from "~/stores/participation";
import { useUser } from "~/stores/user";

// User
const user = useState<User>("user");
const showProfile = computed(
  () => user.value.firstName.length == 0,
);

const userStore = useUser();
const { loading: userLoading } = storeToRefs(userStore);

const updateUser = async (obj: UserProfileFull) => {
  let data = await userStore.update(obj);
  if (data) {
    user.value = data;
  }
};

// Participation
const event = await useEvent();
const participationStore = useParticipation();
const { bike, loading: participationLoading } = storeToRefs(
  participationStore,
);
await participationStore.initialize(event.id);

// Children
const children = ref<User[]>(
  await $fetch<User[]>("/api/children", {
    headers: useRequestHeaders(["cookie"]),
  }),
);

// Contests
const contests = ref<IContest[]>(
  await $fetch<IContest[]>("/api/contests", {
    headers: useRequestHeaders(["cookie"]),
  }),
);

const reloadContests = async () => {
  contests.value =
    await $fetch<IContest[]>("/api/contests");
};

const onContestParticipationSubmit = async (
  contest: IContest,
) => {
  await $fetch<IContest[]>(`/api/contests/participation`, {
    method: "POST",
    body: { eventId: event.id, contestId: contest.id },
  });
  await reloadContests();
};

const onContestParticipationCancel = async (
  contest: IContest,
) => {
  if (!confirm("Вы точно хотите отказаться от участия?")) {
    return;
  }

  await $fetch<IContest[]>(`/api/contests/participation`, {
    method: "DELETE",
    body: { eventId: event.id, contestId: contest.id },
  });
  await reloadContests();
};
</script>
<template>
  <div>
    <div v-if="user">
      <UserProfile
        v-if="showProfile"
        :user="user"
        :loading="userLoading"
        @profile:update="updateUser"
      />
      <EventParticipationForm
        v-else-if="bike.length == 0"
        :loading="participationLoading"
        :eventId="event.id"
        @participation="participationStore.create"
      />
      <EventParticipation
        v-else
        :participation="participationStore"
        :user="user"
        :children="children"
      />
      <ContestParticipation
        v-if="contests.length > 0"
        :contests="contests"
        @participation:submit="onContestParticipationSubmit"
        @participation:cancel="onContestParticipationCancel"
      />
      <p v-else class="py-12 text-center">
        Регистрация в конкурсах будет доступна чуть позже
      </p>
    </div>
    <div v-else>
      <Loading />
    </div>
  </div>
</template>
