// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: [
    "@/assets/styles/main.scss",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
});
