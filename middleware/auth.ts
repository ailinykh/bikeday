export default defineNuxtRouteMiddleware(async (to) => {
  const user = useState("user");
  if (!user.value) {
    return navigateTo(`/login?redirectTo=${to.path}`);
  }
});
