<script setup>
useMeta({
  bodyAttrs: {
    class: 'body-gray',
  },
})

const props = defineProps({
  error: Object,
})

const errors = {
  403: {
    title: 'Требуется аутентификация',
    image: '/static/403.png',
    text: [
      'Если вы не вошли в свою учётную запись, то это можно сделать <a href="/login">здесь</a>.',
    ],
  },
  404: {
    title: 'Вы только что сломали Велодень!',
    image: '/static/404.png',
    text: [
      'Такой страницы на сайте не существует.',
      'Возможно, вы ошиблись адресом или страница была удалена.',
    ],
  },
  500: {
    title: 'Вы только что сломали Велодень!',
    image: '/static/500.png',
    text: [
      'Очень жаль, но наш сервер не смог обработать запрос и сломался.',
      'В любом случае, мы уже в курсе и принимаем меры.',
    ],
  },
}

const data = errors[props.error.statusCode] || errors[500]
</script>

<template>
  <main class="container">
    <div class="text-center pt-5">
      <h2>{{ data.title }}</h2>
      <img :src="data.image" class="my-5" />
      <p v-for="p in data.text" :key="p" v-html="p" />
      <p>Попробуйте начать <NuxtLink to="/">сначала</NuxtLink>.</p>
    </div>
  </main>
</template>

<style scoped></style>
