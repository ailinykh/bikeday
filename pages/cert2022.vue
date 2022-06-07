<script setup>
import { useSessionStore } from '~/store/session'

const session = useSessionStore()
const { user } = session

if (!user) {
  navigateTo('/login')
} else {
  navigateTo('/profile')
}
</script>
<template />
