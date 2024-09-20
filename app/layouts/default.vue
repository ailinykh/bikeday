<template>
  <div class="bikeday-bg-white h-screen overflow-y-auto">
    <Navigation
      :user="user"
      :logout="logout"
      :extended-menu="extendedMenu"
    />
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
import { useAuth } from "~/stores/auth";
import type { User } from "~~/types";

const auth = useAuth();
const user = useState<User | null>("user");

// initialize components based on data attribute selectors
onMounted(() => {
  if (import.meta.client) {
    import("flowbite")
      .then((flowbite) => flowbite.initFlowbite())
      .catch((e) => console.error(e));
  }
});

const extendedMenu = computed<boolean>(
  () =>
    user.value != null &&
    ["volunteer", "admin"].includes(user.value.status),
);

const logout = async () => {
  if (confirm("Вы действительно хотите выйти?")) {
    await auth.logout();
    user.value = null;
    navigateTo("/");
  }
};
</script>
