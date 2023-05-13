<template>
  <div>
    <NuxtErrorBoundary>
      <slot />
      <template #error="{ error }">
        <p>{{ error }}</p>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>
