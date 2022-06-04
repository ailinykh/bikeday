<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const session = useSessionStore()
const { user } = storeToRefs(session)
</script>

<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container-fluid">
      <NuxtLink to="/" class="navbar-brand">Велодень</NuxtLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <NuxtLink to="/profile" class="nav-link" v-if="user"
              >Профайл</NuxtLink
            >
          </li>
          <li class="nav-item">
            <NuxtLink to="/logout" class="nav-link" v-if="user">Выход</NuxtLink>
            <NuxtLink to="/login" class="nav-link" v-else>Вход</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
