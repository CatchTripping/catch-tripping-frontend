<script setup>
import { ref, computed } from 'vue'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Plus, Minus, Crosshair } from 'lucide-vue-next'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

const props = defineProps({
  isMobile: {
    type: Boolean,
    required: true,
  },
})

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

// 카카오맵 설정
const map = ref()
const onLoadKakaoMap = mapRef => {
  map.value = mapRef
}

// 현재 위치
const latitude = ref(null)
const longitude = ref(null)

// 페이징  설정
const page = ref(1) // 현재 페이지
const itemsPerPage = ref(2) // 페이지 당 아이템 개수
const total = ref(locations.length) // 총 아이템 개수

// page 와 itemsPerPage 에 맞게 locations 배열을 슬라이싱하는 computed
const paginatedLocations = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return locations.slice(start, end)
})

const selectedLocation = ref(null)

const zoomIn = () => {
  // 현재 지도의 레벨을 얻어옵니다
  if (map.value) {
    const level = map.value.getLevel()

    // 지도를 1레벨 내립니다 (지도가 확대됩니다)
    map.value.setLevel(level - 1)
  }
}
const zoomOut = () => {
  // 현재 지도의 레벨을 얻어옵니다
  if (map.value) {
    const level = map.value.getLevel()

    // 지도를 1레벨 올립니다 (지도가 축소됩니다)
    map.value.setLevel(level + 1)
  }
}

const centerMap = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        latitude.value = position.coords.latitude
        longitude.value = position.coords.longitude

        if (map.value) {
          // 지도 중심을 부드럽게 이동시킵니다
          // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
          map.value.panTo(
            new kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude,
            ),
          )
        }
      },
      error => {
        console.error('위치를 가져오는데 실패했습니다.', error)
        alert('위치를 가져오는데 실패했습니다.')
      },
    )
  } else {
    alert('Geolocation을 지원하지 않는 브라우저입니다.')
  }
}
</script>
<template>
  <!-- Main Content -->
  <div class="flex flex-col sm:flex-row">
    <!-- Map Area -->
    <div class="relative overflow-hidden flex-grow">
      <!-- Floating Controls -->
      <div class="absolute z-10 right-4 bottom-8 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          class="h-10 w-10 rounded-full shadow-lg bg-white border border-gray-200"
          @click="zoomIn"
        >
          <Plus class="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-10 w-10 rounded-full shadow-lg bg-white border border-gray-200"
          @click="zoomOut"
        >
          <Minus class="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-10 w-10 rounded-full shadow-lg bg-white border border-gray-200"
          @click="centerMap"
        >
          <Crosshair class="h-4 w-4" />
        </Button>
      </div>
      <KakaoMap
        :width="'100%'"
        :height="props.isMobile ? '50vh' : '100vh'"
        :lat="coordinate.lat"
        :lng="coordinate.lng"
        @onLoadKakaoMap="onLoadKakaoMap"
        :draggable="true"
      >
        <KakaoMapMarker
          :lat="coordinate.lat"
          :lng="coordinate.lng"
        ></KakaoMapMarker>
      </KakaoMap>
    </div>

    <!-- Location List -->
    <div class="w-full sm:w-96">
      <div class="flex flex-col justify-between sm:h-[100vh]">
        <!-- 장소 목록-->
        <ScrollArea class="sm:h-[calc(100%-57px)]">
          <div class="p-4 space-y-4">
            <Card
              v-for="location in paginatedLocations"
              :key="location.id"
              :class="[
                'cursor-pointer transition-colors',
                selectedLocation === location.id ? 'bg-muted' : '',
              ]"
              @click="selectedLocation.value = location.id"
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

        <!-- 페이징-->
        <div class="border-t p-2 bg-background">
          <Pagination
            v-model:page="page"
            :total="total"
            :items-per-page="itemsPerPage"
            show-edges
            :default-page="1"
          >
            <PaginationList
              v-slot="{ items }"
              class="flex justify-center items-center gap-1"
            >
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

<style scoped></style>
