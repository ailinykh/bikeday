<template>
  <div class="bikeday-bg-white h-screen">
    <NuxtErrorBoundary>
      <slot />
      <template #error="{ error }">
        <p>{{ error }}</p>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>
