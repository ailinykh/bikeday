<script setup>
useMeta({
  bodyAttrs: {
    class: 'body-green',
  },
})
</script>

<template>
  <div class="soon"></div>
</template>

<style scoped>
.soon {
  height: 310px;
  width: 100%;
  background: url('/static/coming-soon.png') center no-repeat;
  position: absolute;
  top: 50%;
  margin-top: -155px;
}
</style>
