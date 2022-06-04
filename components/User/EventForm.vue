<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store/session'
import { useEventStore } from '~/store/event'
const session = useSessionStore()
const event = useEventStore()

const { isLoading } = storeToRefs(event)
const { create } = event

const bike = ref('')
const district = ref('Северный')
</script>

<template>
  <div class="">
    <h2 class="mt-4">Анкета участника</h2>
    <form
      @submit.prevent="create({ bike, district })"
      class="needs-validation"
      :class="{
        // 'was-validated': error,
      }"
    >
      <div class="mb-3">
        <label for="bike" class="form-label">Велосипед</label>
        <input
          type="text"
          class="form-control"
          id="bike"
          autocapitalize="on"
          v-model="bike"
        />
      </div>
      <div class="mb-3">
        <label for="district" class="form-label">Район</label>
        <select
          class="form-select"
          aria-label="Выберите район"
          v-model="district"
        >
          <option>Северный</option>
          <option>Советский</option>
          <option>Железнодорожный</option>
          <option>Заводской</option>
          <option>Орловский</option>
          <option>Не орловская область</option>
        </select>
      </div>
      <div class="mb-3">
        <button
          class="w-100 btn btn-primary mb-4"
          type="submit"
          :disabled="isLoading"
        >
          <span
            v-show="isLoading"
            class="spinner-border spinner-border-sm mr-1"
          ></span>
          Отправить
        </button>
      </div>
    </form>
  </div>
</template>
