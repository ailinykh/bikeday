// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    tokenSecret: process.env.JWT_TOKEN_SECRET,
    telegram: {
      botSecret: process.env.TELEGRAM_BOT_SECRET,
      botUsername: process.env.TELEGRAM_BOT_USERNAME,
    },
    smsc: {
      login: process.env.SMSC_LOGIN,
      password: process.env.SMSC_PASSWORD,
    },
    smsAero: {
      login: process.env.SMSAERO_LOGIN,
      password: process.env.SMSAERO_PASSWORD,
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: [
    "@/assets/styles/main.scss",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
});
