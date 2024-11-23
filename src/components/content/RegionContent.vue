<script setup>
import { onMounted, watch } from 'vue'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton/index.js'

import { ImageOff } from 'lucide-vue-next'
import AttractionDialog from '@/components/content/AttractionDialog.vue'

const hotPlaces = useHotPlacesStore()

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

watch(
  () => hotPlaces.hotPlaceType,
  () => {
    hotPlaces.debouncedFetchPlaces()
  },
)

watch(
  () => hotPlaces.regionCode,
  () => {
    hotPlaces.debouncedFetchPlaces()
  },
)

watch(
  () => hotPlaces.sigunguCodes,
  () => {
    hotPlaces.debouncedFetchPlaces()
  },
)
</script>

<template>
  <div class="space-y-6 p-6 max-w-[900px]">
    <div class="flex flex-row gap-3">
      <!-- Title-->
      <p class="text-2xl font-bold my-auto">대한민국의</p>
      <!-- Category Title -->
      <Select
        v-model="hotPlaces.hotPlaceType"
        :disabled="hotPlaces.loading"
        @update:modelValue="hotPlaces.loading = true"
      >
        <SelectTrigger
          class="w-[100px] p-0 border-none bg-transparent font-bold text-2xl"
        >
          <SelectValue
            class="text-gradient"
            :placeholder="hotPlaces.hotPlaceType"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              :key="category.id"
              v-for="category in categories"
              :value="category.id"
            >
              {{ category.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <!-- Title-->
      <p class="text-2xl font-bold my-auto">알려드릴게요!</p>
    </div>

    <!-- Region Selector -->
    <Card>
      <Carousel
        :opts="{
          align: 'start',
          loop: true,
        }"
        class="w-full max-w-[calc(100%-120px)] mx-auto"
      >
        <CarouselContent>
          <CarouselItem
            v-for="area in areas"
            :key="area.id"
            class="basis-1/5 md:basis-1/6 lg:basis-1/12 self-center"
          >
            <div class="p-1">
              <Button
                variant="ghost"
                class="w-full flex flex-col items-center gap-2 h-auto py-2 hover:bg-transparent"
                @click="hotPlaces.setAreaCode(area.id)"
              >
                <div
                  :class="
                    cn(
                      'w-12 h-12 rounded-full overflow-hidden box-content',
                      hotPlaces.regionCode === area.id
                        ? 'border-2 border-black'
                        : 'hover:border-2 hover:border-gray-400',
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

    <!-- Map and Location List-->
    <div class="grid lg:grid-cols-[2fr_1fr] grid-cols-1fr gap-2">
      <!-- Map -->
      <Card class="w-full flex justify-center">
        <component
          :is="hotPlaces.renderMap"
          :class="
            cn(
              'relative inset-0 w-full h-full transition-opacity duration-500',
              hotPlaces.loading ? 'opacity-30' : 'opacity-100',
            )
          "
        />
      </Card>

      <!-- Location List -->
      <ScrollArea class="h-[calc(100vh-300px)]">
        <div class="pr-4 space-y-2">
          <template v-if="hotPlaces.loading">
            <Card class="overflow-hidden" v-for="index in 5" :key="index">
              <CardContent class="p-0">
                <div class="flex">
                  <div class="w-1/3">
                    <Skeleton class="w-full h-full aspect-square object-cove" />
                  </div>
                  <div class="w-2/3 p-4 space-y-2">
                    <Skeleton class="h-1/2 w-3/4" />
                    <div class="flex h-1/2 flex-wrap gap-2">
                      <Skeleton class="h-1/2 w-1/4" />
                      <Skeleton class="h-1/2 w-1/4" />
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
                      v-if="place.firstImage"
                      :src="place.firstImage"
                      :alt="place.title"
                      class="lg:w-50 lg:h-50 object-cover aspect-square"
                    />
                    <ImageOff
                      v-else
                      class="w-full h-full object-cover aspect-square p-6"
                      color="gray"
                    />
                  </div>
                  <div class="w-2/3 p-4 lg:p-2 space-y-2">
                    <div class="flex justify-between items-start">
                      <h3
                        class="font-semibold text-lg overflow-ellipsis overflow-hidden whitespace-nowrap"
                      >
                        {{ place.title }}
                      </h3>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span
                        class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {{
                          place.categoryCodesList[
                            place.categoryCodesList.length - 1
                          ].categoryName
                        }}
                      </span>
                      <AttractionDialog
                        :content-id="place.contentId"
                        :images="[
                          { src: place.firstImage, alt: '', caption: '' },
                        ]"
                        :title="place.title"
                      >
                        <Button
                          variant="link"
                          class="inline gap-0 p-0 text-blue-500 text-xs h-min my-auto"
                        >
                          상세보기
                        </Button>
                      </AttractionDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </template>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to top right, #fbbf24, #d946ef);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
