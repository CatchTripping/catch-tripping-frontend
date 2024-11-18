<script setup>
import { onMounted, ref, watch } from 'vue'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Minus, Crosshair, Loader2 } from 'lucide-vue-next'
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
import { useMapStore } from '@/stores/maps.js'

const props = defineProps({
  isMobile: {
    type: Boolean,
    required: true,
  },
})

const maps = useMapStore()

onMounted(() => {
  maps.fetchMaps()
})

// 카카오맵 설정
const map = ref()
const onLoadKakaoMap = mapRef => {
  map.value = mapRef
}

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
        maps.latitude = position.coords.latitude
        maps.longitude = position.coords.longitude

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

watch(
  () => maps.page,
  () => {
    maps.debouncedFetchMaps()
  },
)

watch(
  () => ({ latitude: maps.latitude, longitude: maps.longitude }),
  () => {
    maps.debouncedFetchMaps()
  },
)
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
        :lat="maps.latitude"
        :lng="maps.longitude"
        @onLoadKakaoMap="onLoadKakaoMap"
        :draggable="true"
      >
        <KakaoMapMarker
          :lat="maps.latitude"
          :lng="maps.longitude"
        ></KakaoMapMarker>
      </KakaoMap>
    </div>

    <!-- Location List -->
    <div class="w-full sm:w-96">
      <div class="flex flex-col justify-between sm:h-[100vh] relative">
        <Loader2
          v-if="maps.loading"
          class="animate-spin absolute top-1/2 left-1/2"
        />
        <!-- 장소 목록-->
        <ScrollArea v-if="!maps.loading" class="sm:h-[calc(100%-57px)]">
          <div class="p-4 space-y-4">
            <Card
              v-for="location in maps.attractions"
              :key="location.contentId"
              :class="[
                'cursor-pointer transition-colors',
                selectedLocation === location.contentId ? 'bg-muted' : '',
              ]"
              @click="selectedLocation.value = location.contentId"
            >
              <CardContent class="p-4">
                <div class="space-y-2">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="font-semibold">{{ location.title }}</h3>
                      <p class="text-sm text-muted-foreground">
                        {{
                          location.categoryCodesList[
                            location.categoryCodesList.length - 1
                          ].categoryName
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="text-sm space-y-1">
                    <p>{{ location.addr1 }}</p>
                    <p class="text-muted-foreground">
                      {{ location.addr2 + ' ' + location.zipcode }}
                    </p>
                    <p>{{ location.contentTypeName }}</p>
                    <p class="text-primary">{{ location.tel }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <!-- 페이징-->
        <div v-if="!maps.loading" class="border-t p-2 bg-background">
          <Pagination
            v-model:page="maps.page"
            :total="maps.totalItems"
            :items-per-page="maps.pageSize"
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
                    :variant="item.value === maps.page ? 'default' : 'outline'"
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
