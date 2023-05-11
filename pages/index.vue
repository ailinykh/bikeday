<template>
  <div class="bikeday-bg-white">
    <div class="container mx-auto text-center">
      <section class="p-10">
        <h1 class="text-6xl font-medium py-10">Орловский {{ event.title }}</h1>
        <p class="text-xl mb-14">
          Десятый "Велодень" в Орле назначен на
          <strong class="text-rose-600">28 мая</strong> и приурочен ко
          всемирному дню велосипеда - 3 июня.
        </p>
        <NuxtLink
          to="/login"
          :hidden="0"
          class="rounded-none bg-green-600 px-5 py-3 text-white font-medium"
        >
          Регистрация
        </NuxtLink>
      </section>
      <section class="p-5 my-5">
        <h2 class="text-5xl font-medium py-10">Велодню помогают</h2>
        <div class="grid grid-cols-3 gap-10" v-for="sponsor in sponsors">
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
const event = await useEvent();

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
      title: "Воздушные шары, организация праздников г. Орел",
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
