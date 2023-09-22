import { defineStore } from "pinia";
import { User } from "~/types";

export const useUser = defineStore("user", () => {
  const user = ref<User | null>(null);
  const loading = ref<boolean>(false);
  const initialized = ref<boolean>(false);

  const initialize = async () => {
    if (initialized.value) {
      return;
    }
    initialized.value = true;
    const id = useCookie("user_id");
    const { data } = await useFetch<User>(
      `/api/user/${id.value}`,
    );
    user.value = data.value;
  };

  const update = async ({
    id,
    firstName,
    lastName,
    birthday,
    gender,
  }: User): Promise<User> => {
    loading.value = true;

    const { data, error } = await useFetch<User>(
      `/api/user/${id}`,
      {
        method: "PUT",
        body: { firstName, lastName, birthday, gender },
      },
    );

    loading.value = false;
    user.value = data.value;

    if (!data.value) {
      throw error;
    }
    return data.value;
  };

  return {
    initialize,
    update,
    user,
    loading,
  };
});
