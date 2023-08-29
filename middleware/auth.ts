export default defineNuxtRouteMiddleware(async (to) => {
  const { data } = await useFetch("/api/session", {
    headers: useRequestHeaders(["cookie"]),
  });
  if (!data.value) {
    return navigateTo(`/login?redirectTo=${to.path}`);
  }
});
