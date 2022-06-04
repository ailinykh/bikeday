<script setup>
useMeta({
  bodyAttrs: {
    class: 'body-white',
  },
})

const sponsors = [
  [
    {
      url: 'https://www.orel-adm.ru/',
      imageUrl: '/static/sponsors/orel-adm.png',
      title: 'Администрация города Орла',
    },
    {
      url: 'https://alfanank.ru/',
      imageUrl: '/static/sponsors/alfa.png',
      title: 'Альфа Банк',
    },
    {
      url: 'https://orel.tele2.ru/',
      imageUrl: '/static/sponsors/tele2.png',
      title: 'Tele2',
    },
  ],
  [
    {
      url: 'https://vk.com/izuminka57',
      imageUrl: '/static/sponsors/izuminka.png',
      title: 'Воздушные шары, организация праздников г. Орел',
    },
    {
      url: 'https://vk.com/printkiosk',
      imageUrl: '/static/sponsors/kiosk.png',
      title: 'Киоск печати',
    },
    {
      url: 'https://vk.com/velo_repair',
      imageUrl: '/static/sponsors/bike-repair.png',
      title: 'Первый выездной велоремонт',
    },
  ],
  [
    {
      url: 'https://vk.com/canapushstudio',
      imageUrl: '/static/sponsors/canapush.png',
      title: 'Видеосъемка в Орле',
    },
    {
      url: 'http://pyatnitco.ru/',
      imageUrl: '/static/sponsors/friday.png',
      title: 'Рекламное агентство Пятница',
    },
    {
      url: 'https://mikhalages.com/',
      imageUrl: '/static/sponsors/mikhalages.png',
      title: 'Техническое обеспечение пероприятий',
    },
  ],
]
</script>
<template>
  <div>
    <section class="px-4 py-5 my-5 text-center">
      <h1 class="display-5 fw-bold">Орловский Велодень 2022</h1>
      <div class="col-lg-6 mx-auto">
        <p class="lead mb-4">
          Девятый "Велодень 2022" в Орле назначен на
          <strong class="red">5 июня</strong> и приурочен ко всемирному дню
          велосипеда - 3 июня.
        </p>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <NuxtLink to="/login" class="btn btn-primary btn-lg px-4 gap-3">
            Регистрация
          </NuxtLink>
        </div>
      </div>
    </section>
    <section class="container text-center">
      <h2>Велодню помогают</h2>
      <div class="row" v-for="sponsor in sponsors">
        <div class="col" v-for="s in sponsor">
          <a :href="s.url" target="_blank" rel="nofollow"
            ><img class="d-block mx-auto mb-4" :src="s.imageUrl" :alt="s.title"
          /></a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.red {
  font-weight: bold;
  color: #e74c3c;
}

img {
  max-width: 300px;
}
</style>
