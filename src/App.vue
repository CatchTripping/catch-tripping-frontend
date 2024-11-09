<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user'
import { RouterView } from 'vue-router'

const userStore = useUserStore();

onMounted(async () => {
  try {
    await userStore.loadSessionFromCookies()
  } catch (error) {
    console.error('Failed to load session:', error)
  }
})

onUnmounted(() => {
  userStore.stopSessionCheck()
})
</script>

<template>
  <header></header>

  <RouterView />
</template>

<style scoped></style>
