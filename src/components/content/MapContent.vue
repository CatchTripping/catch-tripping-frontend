<script setup>
import { ref, computed } from 'vue'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import {
  Star,
  Plus,
  Minus,
  Crosshair,
  ChevronRight,
  ChevronLeft,
} from 'lucide-vue-next'
import {
  Pagination,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

const coordinate = {
  lat: 37.566826,
  lng: 126.9786567,
}

const locations = [
  {
    id: 1,
    name: '삼대죽발 시흥대야점',
    category: '족발·보쌈',
    rating: 4.4,
    reviews: 72,
    distance: '리뷰 7건',
    address: '경기 시흥시 비둘기공원5길 6 1층',
    addressDetail: '(지번) 대야동 532-3',
    hours: '매일 14:00 ~ 02:00',
    tel: '031-311-7255',
  },
  {
    id: 2,
    name: '백년불고기물갈비 대야점',
    category: '불고기·두루치기',
    rating: 4.5,
    reviews: 102,
    distance: '리뷰 16건',
    address: '경기 시흥시 비둘기공원5길 15 은행프라자1층 109호',
    addressDetail: '(지번) 대야동 537',
    hours: '화~일 11:00 ~ 23:00',
    tel: '031-435-8431',
  },
  {
    id: 3,
    name: '수궁가야구찜',
    category: '해물·해물탕',
    rating: 4.9,
    reviews: 72,
    distance: '리뷰 16건',
    address: '경기 시흥시 비둘기공원5길 23 108호',
    addressDetail: '(지번) 대야동 540-1',
    hours: '매일 11:00 ~ 22:00',
    tel: '031-313-9500',
  },
  {
    id: 4,
    name: '지글보고싶다 시흥대야점',
    category: '족발·보쌈',
    rating: 5.0,
    reviews: 32,
    distance: '리뷰 2건',
    address: '경기 시흥시 비둘기공원5길 12 2층 204, 205호',
    addressDetail: '(지번) 대야동 531-2',
    hours: '매일 17:00 ~ 05:00',
    tel: '031-317-7239',
  },
]

const selectedLocation = ref(null)
const currentPage = ref(1)
const isListOpen = ref(true)
const locationsPerPage = 2
const totalPages = computed(() =>
  Math.ceil(locations.length / locationsPerPage),
)

const indexOfLastLocation = computed(() => currentPage.value * locationsPerPage)
const indexOfFirstLocation = computed(
  () => indexOfLastLocation.value - locationsPerPage,
)
const currentLocations = computed(() =>
  locations.slice(indexOfFirstLocation.value, indexOfLastLocation.value),
)

const toggleList = () => {
  isListOpen.value = !isListOpen.value
}

const setSelectedLocation = id => {
  selectedLocation.value = id
}

const setCurrentPage = page => {
  if (page < 1) {
    currentPage.value = 1
  } else if (page > totalPages.value) {
    currentPage.value = totalPages.value
  } else {
    currentPage.value = page
  }
}

const zoomIn = () => {
  /* Implement zoom in logic */
}
const zoomOut = () => {
  /* Implement zoom out logic */
}
const centerMap = () => {
  /* Implement center map logic */
}
</script>
<template>
  <!-- Main Content -->
  <div class="flex flex-col sm:flex-row flex-1 overflow-hidden">
    <!-- Map Area -->
    <div class="relative flex-1">
      <KakaoMap
        width="100vw"
        height="100vh"
        class="w-full h-full object-cover"
        :lat="coordinate.lat"
        :lng="coordinate.lng"
        :draggable="true"
      >
        <KakaoMapMarker
          :lat="coordinate.lat"
          :lng="coordinate.lng"
        ></KakaoMapMarker>
      </KakaoMap>
      <!--        <img-->
      <!--          src="/placeholder.svg?height=800&width=1200&text=Map"-->
      <!--          alt="지도"-->
      <!--          class="w-full h-full object-cover"-->
      <!--        />-->

      <!-- Floating Controls -->
      <div class="absolute right-4 bottom-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          class="h-10 w-10 rounded-full shadow-lg"
          @click="zoomIn"
        >
          <Plus class="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          class="h-10 w-10 rounded-full shadow-lg"
          @click="zoomOut"
        >
          <Minus class="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          class="h-10 w-10 rounded-full shadow-lg"
          @click="centerMap"
        >
          <Crosshair class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Toggle List Button -->
    <Button
      variant="secondary"
      size="icon"
      :class="[
        'absolute top-1/2 -translate-y-1/2 h-10 w-6 rounded-l-full rounded-r-none shadow-lg hidden sm:flex z-10 transition-all duration-300 ease-in-out',
        isListOpen ? 'right-[400px]' : 'right-0',
      ]"
      @click="toggleList"
      :aria-label="isListOpen ? '장소 목록 닫기' : '장소 목록 열기'"
    >
      <ChevronRight v-if="isListOpen" class="h-4 w-4" />
      <ChevronLeft v-else class="h-4 w-4" />
    </Button>

    <!-- Location List -->
    <div
      :class="[
        'w-full sm:w-[400px] border-t sm:border-l transition-all duration-300 ease-in-out relative',
        isListOpen
          ? 'sm:w-[400px] sm:overflow-visible'
          : 'sm:w-0 sm:overflow-hidden',
      ]"
    >
      <div
        :class="[
          'transition-opacity duration-300 ease-in-out',
          isListOpen ? 'opacity-100' : 'opacity-0',
        ]"
      >
        <ScrollArea class="h-[calc(100%-96px)]">
          <div class="p-4 space-y-4">
            <Card
              v-for="location in currentLocations"
              :key="location.id"
              :class="[
                'cursor-pointer transition-colors',
                selectedLocation === location.id ? 'bg-muted' : '',
              ]"
              @click="setSelectedLocation(location.id)"
            >
              <CardContent class="p-4">
                <div class="space-y-2">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="font-semibold">{{ location.name }}</h3>
                      <p class="text-sm text-muted-foreground">
                        {{ location.category }}
                      </p>
                    </div>
                    <div class="flex items-center gap-1">
                      <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span class="font-semibold">{{ location.rating }}</span>
                      <span class="text-sm text-muted-foreground"
                        >({{ location.reviews }})</span
                      >
                    </div>
                  </div>
                  <div class="text-sm space-y-1">
                    <p>{{ location.address }}</p>
                    <p class="text-muted-foreground">
                      {{ location.addressDetail }}
                    </p>
                    <p>영업시간: {{ location.hours }}</p>
                    <p class="text-primary">{{ location.tel }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <div
          class="absolute bottom-0 left-0 right-0 border-t p-2 bg-background"
        >
          <!--                  <PaginationPrevious @click="setCurrentPage(currentPage - 1)" />-->
          <!--                  <PaginationNext @click="setCurrentPage(currentPage + 1)" />-->
          <Pagination
            v-slot="{ page }"
            :total="100"
            :sibling-count="1"
            show-edges
            :default-page="1"
          >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst />
              <PaginationPrev />

              <template v-for="(item, index) in items">
                <PaginationListItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                >
                  <Button
                    class="w-10 h-10 p-0"
                    :variant="item.value === page ? 'default' : 'outline'"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext />
              <PaginationLast />
            </PaginationList>
          </Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 스타일이 필요하다면 추가하세요 */
</style>
