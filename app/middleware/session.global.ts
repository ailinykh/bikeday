export default defineNuxtRouteMiddleware(async (to) => {
  const user = useState("user");
  const cookie = useCookie("user_id");
  if (cookie.value && !user.value) {
    const { data } = await useFetch(
      `/api/user/${cookie.value}`,
    );
    user.value = data.value;
  }
});
