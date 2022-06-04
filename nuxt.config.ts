import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: `Велодень ${new Date().getFullYear()}`,
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: `Велодень в Орле ${new Date().getFullYear()}`,
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  buildModules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.scss'],
  meta: {
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
      },
    ],
  },
  runtimeConfig: {
    smscLogin: process.env.SMSC_LOGIN,
    smscPassword: process.env.SMSC_PASSWORD,
    botToken: process.env.BOT_TOKEN,
    botChatId: process.env.BOT_CHAT_ID,
  },
})
