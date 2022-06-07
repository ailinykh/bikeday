<script setup>
const props = defineProps({
  user: Object,
})
</script>

<template>
  <div class="my-4 text-center">
    <h2>Ура! Вы участник велодня 2022!</h2>
    <div class="m-5">
      <a
        class="btn btn-primary"
        :href="`https://cert.bikeday.me/2022?name=${user.firstName}%20${user.lastName}`"
        >Скачать сертификат</a
      >
    </div>
  </div>
</template>
