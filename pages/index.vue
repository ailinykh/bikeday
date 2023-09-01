<template>
  <div class="bikeday-bg-white">
    <div class="container mx-auto text-center">
      <section class="mb-14 p-10">
        <h1 class="py-10 text-6xl font-medium">
          Орловский {{ event.title }}
        </h1>
        <p class="my-8 text-xl">
          Десятый "Велодень" в Орле пройдёт ближе
          <!-- TODO: event.date -->
          <strong class="text-rose-600"
            >к концу сентября</strong
          >
        </p>
        <p>Подробности будут чуть позже</p>
        <NuxtLink
          v-if="user"
          to="/event"
          :hidden="0"
          class="rounded-none bg-green-600 px-5 py-3 font-medium text-white"
        >
          Личный кабинет
        </NuxtLink>
        <!-- <NuxtLink
          v-else
          to="/login"
          :hidden="0"
          class="rounded-none bg-green-600 px-5 py-3 font-medium text-white"
        >
          Регистрация
        </NuxtLink> -->
      </section>
      <section class="my-5 p-5">
        <h2 class="py-10 text-5xl font-medium">
          Велодню помогают
        </h2>
        <div
          class="grid grid-cols-3 gap-10"
          v-for="sponsor in sponsors"
        >
          <div class="" v-for="s in sponsor">
            <NuxtLink :href="s.url" target="_blank"
              ><img
                class="d-block mx-auto mb-4"
                :src="s.imageUrl"
                :alt="s.title"
            /></NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
});

const event = await useEvent();
const user = useState("user");

const sponsors = [
  [
    {
      url: "https://www.orel-adm.ru/",
      imageUrl: "/static/sponsors/orel-adm.png",
      title: "Администрация города Орла",
    },
    {
      url: "https://alfanank.ru/",
      imageUrl: "/static/sponsors/alfa.png",
      title: "Альфа Банк",
    },
    {
      url: "https://orel.tele2.ru/",
      imageUrl: "/static/sponsors/tele2.png",
      title: "Tele2",
    },
  ],
  [
    {
      url: "https://vk.com/izuminka57",
      imageUrl: "/static/sponsors/izuminka.png",
      title:
        "Воздушные шары, организация праздников г. Орел",
    },
    {
      url: "https://vk.com/printkiosk",
      imageUrl: "/static/sponsors/kiosk.png",
      title: "Киоск печати",
    },
    {
      url: "https://vk.com/velo_repair",
      imageUrl: "/static/sponsors/bike-repair.png",
      title: "Первый выездной велоремонт",
    },
  ],
  [
    {
      url: "https://vk.com/canapushstudio",
      imageUrl: "/static/sponsors/canapush.png",
      title: "Видеосъемка в Орле",
    },
    {
      url: "http://pyatnitco.ru/",
      imageUrl: "/static/sponsors/friday.png",
      title: "Рекламное агентство Пятница",
    },
    {
      url: "https://mikhalages.com/",
      imageUrl: "/static/sponsors/mikhalages.png",
      title: "Техническое обеспечение пероприятий",
    },
  ],
];
</script>
