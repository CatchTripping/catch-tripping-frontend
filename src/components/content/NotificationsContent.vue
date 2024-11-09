<script setup>
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.js'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>알림</CardTitle>
    </CardHeader>
    <CardContent>
      <ul class="space-y-4">
        <li
          v-for="i in 5"
          :key="i"
          class="flex items-start space-x-2 p-2 bg-gray-50 rounded-md"
        >
          <div
            class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
          >
            {{ String.fromCharCode(65 + i - 1) }}
          </div>
          <div>
            <p class="font-medium">새로운 알림 {{ i }}</p>
            <p class="text-sm text-gray-500">알림 내용 {{ i }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ i }}시간 전</p>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>

<style scoped></style>
