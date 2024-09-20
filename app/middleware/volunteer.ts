import type { User } from "~~/types";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useState<User>("user");
  if (!user.value) {
    return navigateTo(`/login?redirectTo=${to.path}`);
  }

  if (!["volunteer", "admin"].includes(user.value.status)) {
    return navigateTo(`/login?redirectTo=${to.path}`);
  }
});
