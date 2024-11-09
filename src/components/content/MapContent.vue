<script setup>
import { Coffee, Landmark, Map, Utensils } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.js'
import { Button } from '@/components/ui/button/index.js'
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>지도</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex space-x-2 mb-4">
        <Button variant="outline" size="sm" class="rounded-full">
          <Coffee class="h-4 w-4 mr-2" />
          카페
        </Button>
        <Button variant="outline" size="sm" class="rounded-full">
          <Utensils class="h-4 w-4 mr-2" />
          음식점
        </Button>
        <Button variant="outline" size="sm" class="rounded-full">
          <Landmark class="h-4 w-4 mr-2" />
          관광지
        </Button>
      </div>
      <div
        class="aspect-video bg-gray-200 rounded-md flex items-center justify-center"
      >
        <Map class="h-16 w-16 text-gray-400" />
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
/* 스타일이 필요하다면 추가하세요 */
</style>
