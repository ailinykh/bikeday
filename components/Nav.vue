<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'

const session = useSessionStore()
const { user, isVolunteer } = storeToRefs(session)
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
          <li class="nav-item" v-show="isVolunteer">
            <NuxtLink to="/admin/register" class="nav-link">Рега</NuxtLink>
          </li>
          <li class="nav-item" v-show="isVolunteer">
            <NuxtLink to="/admin/contests" class="nav-link">Конкурсы</NuxtLink>
          </li>
          <li class="nav-item" v-show="user">
            <NuxtLink to="/profile" class="nav-link">Личный кабинет</NuxtLink>
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
