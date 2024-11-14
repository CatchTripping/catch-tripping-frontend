<script setup>
import { onMounted, ref } from 'vue'
import { useHotPlacesStore } from '@/stores/hotplaces'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ChevronDown, Heart } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton/index.js'

const hotPlaces = useHotPlacesStore()

const likedLocations = ref([])

const toggleLike = locationId => {
  const index = likedLocations.value.indexOf(locationId)
  if (index === -1) {
    likedLocations.value.push(locationId)
  } else {
    likedLocations.value.splice(index, 1)
  }
}

onMounted(() => {
  hotPlaces.fetchPlaces() // store 의 fetchPlaces 메서드 호출
})

const areas = [
  { id: 1, name: '서울' },
  { id: 2, name: '인천' },
  { id: 3, name: '대전' },
  { id: 4, name: '대구' },
  { id: 5, name: '광주' },
  { id: 6, name: '부산' },
  { id: 7, name: '울산' },
  { id: 8, name: '세종' },
  { id: 31, name: '경기' },
  { id: 32, name: '강원' },
  { id: 33, name: '충북' },
  { id: 34, name: '충남' },
  { id: 35, name: '경북' },
  { id: 36, name: '경남' },
  { id: 37, name: '전북' },
  { id: 38, name: '전남' },
  { id: 39, name: '제주' },
]

const categories = [
  { id: 'Place', name: '여행지' },
  { id: 'Accommodation', name: '숙소' },
  { id: 'Restaurant', name: '맛집' },
]

const getAreaImageSrc = areaId => {
  return new URL(
    `/src/assets/area_code/area_code_${areaId}.png`,
    import.meta.url,
  ).href
}

const getPlaceImageSrc = image => {
  if (image === '') {
    return new URL(`/src/assets/no_picture.png`, import.meta.url).href
  } else {
    return new URL(image)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Category Title -->
    <h3 class="text-2xl font-semibold">우리 지역,</h3>
    <div class="flex items-center gap-2">
      <div class="relative inline-block">
        <select
          class="appearance-none bg-transparent pr-8 font-semibold text-lg focus:outline-none"
          v-model="hotPlaces.hotPlaceType"
          aria-label="카테고리 선택"
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <ChevronDown
          class="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none"
        />
      </div>
      <span class="text-lg"> 알려드릴게요!</span>
    </div>

    <div>
      <!-- Region Selector -->
      <Card>
        <Carousel
          :opts="{
            align: 'start',
            loop: true,
          }"
          class="w-full max-w-sm mx-auto"
        >
          <CarouselContent>
            <CarouselItem
              v-for="area in areas"
              :key="area.id"
              class="basis-1/5 self-center"
            >
              <div class="p-1">
                <Button
                  variant="ghost"
                  class="w-full flex flex-col items-center gap-2 h-auto py-2"
                  @click="hotPlaces.regionCode = area.id"
                >
                  <div
                    :class="
                      cn(
                        'w-12 h-12 rounded-full overflow-hidden box-content',
                        hotPlaces.regionCode === area.id
                          ? 'border-2 border-black'
                          : 'border-none',
                      )
                    "
                  >
                    <img
                      :src="getAreaImageSrc(area.id)"
                      :alt="area.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    :class="
                      cn(
                        hotPlaces.regionCode === area.id
                          ? 'text-lg font-semibold'
                          : 'text-sm',
                      )
                    "
                    >{{ area.name }}</span
                  >
                </Button>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Card>
      <!-- Map -->
      <div class="lg:w-1/2">
        <div
          class="aspect-[4/3] bg-gray-100 rounded-lg border relative overflow-hidden"
        >
          <component
            :is="hotPlaces.renderMap"
            :class="
              cn(
                'absolute inset-0 w-full h-full transition-opacity duration-500',
                hotPlaces.loading ? 'opacity-30' : 'opacity-100',
              )
            "
          />
        </div>
      </div>
    </div>

    <!-- Location List -->

    <ScrollArea class="h-[calc(100vh-300px)]">
      <div class="pr-4 space-y-4">
        <template v-if="hotPlaces.loading">
          <Card class="overflow-hidden" v-for="index in 4" :key="index">
            <CardContent class="p-0">
              <div class="flex">
                <div class="w-1/3">
                  <Skeleton class="h-full aspect-square" />
                </div>
                <div class="w-2/3 p-4 space-y-2">
                  <Skeleton class="h-6 w-3/4" />
                  <Skeleton class="h-4 w-1/2" />
                  <div class="flex flex-wrap gap-2">
                    <Skeleton class="h-6 w-16" />
                    <Skeleton class="h-6 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </template>
        <template v-else>
          <Card
            v-for="place in hotPlaces.places"
            :key="place.contentId"
            class="overflow-hidden"
          >
            <CardContent class="p-0">
              <div class="flex">
                <div class="w-1/3">
                  <img
                    :src="getPlaceImageSrc(place.firstImage)"
                    :alt="place.title"
                    class="w-full h-full object-cover aspect-square"
                  />
                </div>
                <div class="w-2/3 p-4 space-y-2">
                  <div class="flex justify-between items-start">
                    <h3 class="font-semibold text-lg">{{ place.title }}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      :class="
                        cn(
                          'rounded-full',
                          likedLocations.includes(place.id) && 'text-red-500',
                        )
                      "
                      @click="toggleLike(place.id)"
                      :aria-label="
                        likedLocations.includes(place.id)
                          ? '좋아요 취소'
                          : '좋아요'
                      "
                    >
                      <Heart
                        class="h-5 w-5"
                        :fill="
                          likedLocations.includes(place.id)
                            ? 'currentColor'
                            : 'none'
                        "
                      />
                    </Button>
                  </div>
                  <p class="text-sm text-gray-500">{{ place.region }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in place.tags"
                      :key="tag"
                      class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </template>
      </div>
    </ScrollArea>
  </div>
</template>

<style scoped></style>
