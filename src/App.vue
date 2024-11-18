<script setup>
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
</script>

<template>
  <header></header>
  <Toaster />
  <SonnerToaster richColors closeButton position="top-right" />
  <RouterView />
</template>

<style scoped></style>
