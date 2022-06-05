<script setup lang="ts">
useMeta({
  bodyAttrs: {
    class: 'body-white',
  },
})

const mode = ref('new')

const switchTo = (state: string) => {
  mode.value = state
}

const register = (user, band) => {
  console.log(user, band)
}

import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user'
</script>

<template>
  <div class="my-4">
    <div class="container">
      <div class="row">
        <div class="col">
          <a
            href="#"
            class="btn btn-link"
            @click="switchTo('existing')"
            v-show="mode == 'new'"
          >
            Есть регистрация на сайте
          </a>
          <strong v-show="mode == 'existing'">Есть регистрация на сайте</strong>
          /
          <a
            href="#"
            class="btn btn-link"
            @click="switchTo('new')"
            v-show="mode == 'existing'"
          >
            Новый участник
          </a>
          <strong v-show="mode == 'new'">Новый участник</strong>
        </div>
      </div>
      <RegistrationFormNew v-if="mode == 'new'" />
      <RegistrationFormExisting v-else />
    </div>
  </div>
</template>
