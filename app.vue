<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
const event = await useEvent();

useSeoMeta({
  ogTitle: event.title,
  description:
    "Велодень — ежегодный праздник, который отмечают велосипедисты России преимущественно в конце мая",
  ogDescription:
    "Велодень — ежегодный праздник, который отмечают велосипедисты России преимущественно в конце мая",
  ogImage: `/static/logo-${new Date(
    event.date,
  ).getFullYear()}.jpg`,
  ogType: "website",
  keywords:
    "велодень, велодень в Орле, Орловский велодень, праздник велосипедистов, велопробег в Орле",
});

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - ${event.title}`
      : event.title;
  },
});
</script>
