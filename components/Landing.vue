<script setup>
useMeta({
  bodyAttrs: {
    class: 'body-white',
  },
})
</script>
<template>
  <div class="px-4 py-5 my-5 text-center">
    <img class="d-block mx-auto mb-4" src="/static/tele2.png" alt="Tele2" />
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
