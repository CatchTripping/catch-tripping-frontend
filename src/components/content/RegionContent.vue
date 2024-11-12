<script setup>
import SeoulMap from '@/components/map/SeoulMap.vue'
import { onMounted } from 'vue'
import { useHotPlacesStore } from '@/stores/hotplaces'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const hotPlaces = useHotPlacesStore()

onMounted(() => {
  hotPlaces.fetchPlaces() // store의 fetchPlaces 메서드 호출
})
</script>

<template>
  <div class="flex justify-center">
    <Carousel
      class="relative w-full max-w-sm"
      :opts="{
        align: 'start',
      }"
    >
      <CarouselContent>
        <CarouselItem
          v-for="(_, index) in 5"
          :key="index"
          class="md:basis-1/2 lg:basis-1/3"
        >
          <div class="p-1">
            <Card>
              <CardContent
                class="flex aspect-square items-center justify-center p-6"
              >
                <span class="text-3xl font-semibold">{{ index + 1 }}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>

  <div>
    <h1>Hot Places</h1>

    <!-- 로딩 상태 표시 -->
    <div v-if="hotPlaces.loading">Loading...</div>

    <!-- 에러 상태 표시 -->
    <div v-if="hotPlaces.error" class="error">
      There was an error loading the places: {{ error.message }}
    </div>

    <!-- 핫플레이스 리스트 -->
    <ul v-if="hotPlaces.places.length > 0">
      <li v-for="place in hotPlaces.places" :key="place.contentId">
        <img :src="place.firstImage" alt="Place image" width="100" />
        <p>{{ place.title }}</p>
      </li>
    </ul>

    <!-- 핫플레이스가 없을 경우 -->
    <div v-else>No hot places available.</div>
  </div>

  <SeoulMap></SeoulMap>
</template>

<style scoped></style>
