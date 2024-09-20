<script setup lang="ts">
definePageMeta({
  middleware: ["volunteer"],
});

import type {
  IContest,
  IParticipation,
  IContestParticipation,
  User as IUser,
} from "~~/types";

type User = IUser & {
  EventParticipation: IParticipation[];
  ContestParticipation?: IContestParticipation[];
};
type Contest = IContest & {
  ContestParticipation: { user: User; score: string }[];
};

const event = await useEvent();

const searchInput = ref();
const loading = ref<boolean>(false);
const message = ref<string | null>(null);
const { params } = useRoute();
const contest = ref<Contest>(
  await $fetch<Contest>(
    `/api/admin/contests/${params.contestId}`,
    { headers: useRequestHeaders(["cookie"]) },
  ),
);

useHead({
  title: contest.value.title,
});

const onChangeContestState = async () => {
  contest.value = await $fetch<Contest>(
    `/api/admin/contests/${params.contestId}`,
    {
      method: "PUT",
      body: {
        status:
          contest.value.status == "opened"
            ? "closed"
            : "opened",
      },
    },
  );
};

const users = ref<User[]>([]);

const onSearch = async (term: string) => {
  message.value = null;
  loading.value = true;
  users.value = await $fetch<User[]>(
    `/api/admin/contests/search?term=${term}`,
  );
  loading.value = false;
};

const onAddParticipation = async (user: User) => {
  message.value = null;
  loading.value = true;
  await $fetch<User[]>(
    "/api/admin/contests/participation",
    {
      method: "POST",
      body: {
        userId: user.id,
        eventId: event.id,
        contestId: parseInt(params.contestId.toString()),
        score: "",
      },
    },
  );
  loading.value = false;
  message.value = `${user.firstName} ${user.lastName} добавлен в ${contest.value.title}`;
  searchInput.value = "";
};
</script>

<template>
  <div>
    <h2
      class="mb-3 text-center text-2xl font-medium text-gray-900 dark:text-white"
    >
      {{ contest.title }}
    </h2>
    <div class="mb-6">
      <p>
        Регистрация на участие
        <span
          class="font-bold"
          :class="{
            'text-green-700': contest.status == 'opened',
            'text-red-700': contest.status == 'closed',
          }"
        >
          {{
            contest.status == "opened"
              ? "открыта"
              : "закрыта"
          }}</span
        >
        <button
          type="button"
          class="ml-3 font-bold"
          :class="{
            'text-red-700': contest.status == 'opened',
            'text-green-700': contest.status == 'closed',
          }"
          @click="onChangeContestState"
        >
          {{
            contest.status == "opened"
              ? "[ закрыть ]"
              : "[ открыть ]"
          }}
        </button>
      </p>
    </div>
    <div>
      <form
        class="my-6 flex items-center"
        @submit.prevent="() => onSearch(searchInput.value)"
      >
        <div class="relative w-full">
          <input
            ref="searchInput"
            type="tel"
            autocomplete="off"
            autocorrect="off"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
            placeholder="последние цифры браслета или номера телефона"
            :disabled="loading"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="ml-2 rounded-lg border border-green-700 bg-green-700 p-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-75 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          <svg
            class="h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </form>
      <p
        v-if="message"
        class="pb-4 font-medium text-green-800"
      >
        {{ message }}
      </p>
      <table
        v-if="users.length > 0"
        class="my-8 w-full text-left text-sm text-gray-500 dark:text-gray-400"
      >
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-2 py-2 font-medium text-gray-900 dark:text-white"
            >
              {{ user.firstName + " " + user.lastName }}
              <Icon
                v-if="
                  !['user', 'child'].includes(user.status)
                "
                class="text-red-500"
                name="material-symbols:pedal-bike-outline"
              />
              <Icon
                v-if="user.status == 'child'"
                name="cil:child"
              />
              <p v-else class="text-xs font-light">
                {{ user.phone }}
              </p>
            </th>
            <td class="px-2 py-2 font-bold">
              {{
                (user.EventParticipation[0] &&
                  user.EventParticipation[0].band) ||
                "нет браслета"
              }}
            </td>
            <td class="px-2 py-2">
              <button
                v-if="
                  !user.ContestParticipation ||
                  !user.ContestParticipation.find(
                    (p) => p.contestId == contest.id,
                  )
                "
                @click="
                  () => {
                    onAddParticipation(user);
                  }
                "
              >
                <Icon name="gridicons:add" class="mr-3" />
              </button>
              <span v-else>Уже в конкурсе</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2
      class="text-center text-xl font-medium text-gray-900 dark:text-white"
    >
      Участники
    </h2>
    <table
      class="my-6 w-full text-left text-sm text-gray-500 dark:text-gray-400"
    >
      <tbody>
        <tr
          v-for="{
            user,
            score,
          } in contest.ContestParticipation"
          :key="user.id"
          class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-2 py-2 font-medium text-gray-900 dark:text-white"
          >
            {{ user.firstName + " " + user.lastName }}
            <Icon
              v-if="
                !['user', 'child'].includes(user.status)
              "
              class="text-red-500"
              name="material-symbols:pedal-bike-outline"
            />
            <Icon
              v-if="user.status == 'child'"
              name="cil:child"
            />
          </th>
          <td class="px-2 py-2">
            {{ user.phone }}
          </td>
          <td class="px-2 py-2 font-bold">
            {{
              user.EventParticipation[0] &&
              user.EventParticipation[0].band
            }}
          </td>
          <td class="px-2 py-2">
            {{ score }}
          </td>
          <td class="px-2 py-2">
            <a
              :href="`/admin/contest/${contest.id}/participation/${user.id}`"
            >
              <Icon name="iconamoon:edit" class="mr-3" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
