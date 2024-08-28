// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      telegram: {
        botUsername: process.env.TELEGRAM_BOT_USERNAME,
      },
    },
    tokenSecret: process.env.JWT_TOKEN_SECRET,
    telegram: {
      botSecret: process.env.TELEGRAM_BOT_SECRET,
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      supportChatId: process.env.TELEGRAM_SUPPORT_CHAT_ID,
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

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-icon",
  ],

  css: ["@/assets/styles/main.scss"],

  app: {
    head: {
      script: [
        {
          // TODO: import from flowbite
          src: "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/datepicker.min.js",
        },
      ],
      link: [
        {
          href: "/apple-touch-icon.png",
          rel: "apple-touch-icon",
          sizes: "180x180",
        },
        {
          href: "/favicon-32x32.png",
          rel: "icon",
          sizes: "32x32",
          type: "image/png",
        },
        {
          href: "/favicon-16x16.png",
          rel: "icon",
          sizes: "16x16",
          type: "image/png",
        },
        {
          href: "/site.webmanifest",
          rel: "manifest",
        },
        {
          color: "#5bbad5",
          href: "/safari-pinned-tab.svg",
          rel: "mask-icon",
        },
      ],
      meta: [
        {
          name: "msapplication-TileColor",
          content: "#603cba",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
        {
          name: "yandex-verification",
          content: "6a4d723ae2b56437",
        },
      ],
    },
  },

  compatibilityDate: "2024-08-28",
});