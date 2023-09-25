import { defineStore } from "pinia";
import { AuthRequest, User } from "~/types";

type AuthState = {
  authRequest?: AuthRequest;
  errorMessage?: string;
  loading: boolean;
};

const localize = (errorMessage: string): string => {
  const errors: Record<string, string> = {
    "Insufficient digits": "Недостаточно цифр",
    "Unexpected phone format":
      "Номер должен начинаться с +7 (9..)",
    "Phone request limit exceeded":
      "Повторите запрос чуть позже",
    "Code invalid or expired": "Недействительный код",
    "Too Many Requests": "Слишком много запросов",
  };

  return errors[errorMessage] || "Неизвестная ошибка";
};

export const useAuth = defineStore("auth", {
  state: (): AuthState => {
    return {
      authRequest: undefined,
      errorMessage: undefined,
      loading: false,
    };
  },
  actions: {
    async login(phone: string) {
      this.loading = true;
      this.errorMessage = undefined;

      const { error, data } =
        await useLazyFetch<AuthRequest>(`/api/session`, {
          method: "POST",
          body: { phone },
        });

      this.loading = false;

      if (error.value) {
        const message = error.value.statusMessage || "";
        this.errorMessage = localize(message);
      } else if (data.value) {
        this.authRequest = data.value;
      }
    },

    async confirm(code: string, phone: string) {
      this.loading = true;
      this.errorMessage = undefined;

      const { error, data } = await useLazyFetch<User>(
        `/api/session`,
        {
          method: "PUT",
          body: { code, phone },
        },
      );

      this.loading = false;

      if (error.value) {
        const message = error.value.statusMessage || "";
        this.errorMessage = localize(message);
      } else if (data.value) {
        const {
          query: { redirectTo },
        } = useRoute();
        // assume user set by middleware through `useState`
        window.location.href = redirectTo
          ? redirectTo.toString()
          : "/event"; // hack to update navigation menu items
      }
    },

    async logout() {
      const { error } = await useLazyFetch("/api/session", {
        method: "DELETE",
      });
      if (error.value) {
        throw error.value;
      }
    },
  },
});
