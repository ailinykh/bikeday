<script setup lang="ts">
import { storeToRefs } from "pinia";
import { User } from "~/types";
import { useParticipation } from "~/stores/participation";
import { useUser } from "~/stores/user";

definePageMeta({
  middleware: ["auth"],
});

const user = useState<User>("user");
const showProfile = computed(
  () => user.value.firstName.length == 0,
);

const userStore = useUser();
const { loading: userLoading } = storeToRefs(userStore);

const updateUser = async (obj: {
  id: number;
  firstName: string;
  lastName: string;
}) => {
  let data = await userStore.update(obj);
  if (data) {
    user.value = data;
  }
};

const event = await useEvent();
const participationStore = useParticipation();
const { bike, loading: participationLoading } = storeToRefs(
  participationStore,
);
await participationStore.initialize(event.id);
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
      />
    </div>
    <div v-else>
      <Loading />
    </div>
  </div>
</template>
