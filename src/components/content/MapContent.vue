<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Crosshair, Loader2, Minus, Plus } from 'lucide-vue-next'
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
import { cn } from '@/lib/utils.js'
import { toast as sonner } from 'vue-sonner'
import AttractionDialog from '@/components/content/AttractionDialog.vue'

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

const mapLevel = computed(() => {
  return props.isMobile ? 6 : 4
})

// 카카오맵 설정
const map = ref()
const onLoadKakaoMap = mapRef => {
  map.value = mapRef
  map.value.setLevel(mapLevel.value)
}

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
        sonner.warning('위치를 가져오는데 실패했습니다.', {
          description: error,
        })
      },
    )
  } else {
    sonner.warning('위치를 지원하지 않는 브라우저입니다.')
    alert('')
  }
}

const setBounds = () => {
  // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
  const bounds = new kakao.maps.LatLngBounds()
  let point
  maps.attractions.forEach(item => {
    point = new kakao.maps.LatLng(item.mapy, item.mapx)
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(point)
  })
  map.value.setBounds(bounds)
}

const onClickKakaoMapMarker = index => {
  maps.visibleIndex = index
  map.value.setLevel(mapLevel.value)
  map.value.setCenter(
    new kakao.maps.LatLng(
      maps.attractions[index].mapy,
      maps.attractions[index].mapx,
    ),
  )
}

const onClickKakaoMapAnchor = index => {
  maps.visibleIndex = index
  map.value.setLevel(mapLevel.value)
  map.value.setCenter(
    new kakao.maps.LatLng(
      maps.attractions[index].mapy,
      maps.attractions[index].mapx,
    ),
  )
}

const onClickCard = index => {
  maps.visibleIndex = index
  map.value.setLevel(mapLevel.value)
  map.value.setCenter(
    new kakao.maps.LatLng(
      maps.attractions[index].mapy,
      maps.attractions[index].mapx,
    ),
  )
}

const mouseOverKakaoMapMarker = index => {
  maps.visibleInfo = index
}

const mouseOutKakaoMapMarker = () => {
  maps.visibleInfo = -1
}

watch(
  () => props.isMobile,
  () => {
    setBounds()
  },
)

watch(
  () => maps.attractions,
  () => {
    setBounds()
  },
)

watch(
  () => maps.page,
  () => {
    maps.visibleIndex = -1
    maps.visibleInfo = -1
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
        <template
          v-for="(item, index) in maps.attractions"
          :key="item.contentId"
        >
          <KakaoMapMarker
            v-if="index === maps.visibleIndex"
            :lat="item.mapy"
            :lng="item.mapx"
            :clickable="true"
            @onClickKakaoMapMarker="onClickKakaoMapMarker(index)"
            @mouseOverKakaoMapMarker="mouseOverKakaoMapMarker(index)"
            @mouseOutKakaoMapMarker="mouseOutKakaoMapMarker"
            :image="{
              imageSrc: '/src/assets/map/2/' + (index + 1) + '.png',
              imageWidth: 39,
              imageHeight: 57,
            }"
          >
            <template v-slot:infoWindow>
              <div :class="cn('visible p-2')">
                {{
                  item.title.length > 8
                    ? item.title.slice(0, 8) + '...'
                    : item.title
                }}
              </div>
            </template>
          </KakaoMapMarker>
          <KakaoMapMarker
            v-else
            :lat="item.mapy"
            :lng="item.mapx"
            :clickable="true"
            :infoWindow="{
              content: item.title,
              visible: maps.visibleInfo === index,
            }"
            @onClickKakaoMapMarker="onClickKakaoMapMarker(index)"
            @mouseOverKakaoMapMarker="mouseOverKakaoMapMarker(index)"
            @mouseOutKakaoMapMarker="mouseOutKakaoMapMarker"
            :image="{
              imageSrc: '/src/assets/map/1/' + (index + 1) + '.png',
              imageWidth: 29,
              imageHeight: 50,
            }"
          >
            <template v-slot:infoWindow>
              <div
                :class="
                  cn(
                    maps.visibleInfo === index ? 'visible' : 'invisible',
                    'p-2',
                  )
                "
              >
                {{
                  item.title.length > 8
                    ? item.title.slice(0, 8) + '...'
                    : item.title
                }}
              </div>
            </template>
          </KakaoMapMarker>
        </template>
      </KakaoMap>
    </div>

    <!-- Location List -->
    <div class="w-full sm:w-96">
      <div class="flex flex-col justify-center sm:h-[100vh] Z">
        <Loader2
          size="100"
          color="#172341"
          v-if="maps.loading"
          class="animate-spin self-center"
        />
        <!-- 장소 목록-->
        <ScrollArea v-if="!maps.loading" class="sm:h-[calc(100%-57px)]">
          <div class="p-4 space-y-4">
            <Card
              v-for="(location, index) in maps.attractions"
              :key="location.contentId"
              :class="[
                'transition-colors',
                maps.visibleIndex === index ? 'bg-muted' : '',
              ]"
            >
              <CardContent class="pb-4 pt-2 px-4">
                <div class="space-y-2">
                  <div class="flex items-start justify-between">
                    <div>
                      <div class="flex items-center gap-1">
                        <Button
                          variant="link"
                          class="inline gap-0 p-0 text-blue-500 font-bold"
                          @click="onClickKakaoMapAnchor(index)"
                        >
                          {{ String.fromCharCode(65 + index) }}
                        </Button>
                        <h3
                          class="font-semibold cursor-pointer hover:underline"
                          @click="onClickCard(index)"
                        >
                          {{ location.title }}
                        </h3>
                      </div>
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
                    <!--                    <p>{{ location.contentTypeName }}</p>-->
                    <div class="flex items-center gap-1 h-4">
                      <AttractionDialog
                        :content-id="location.contentId"
                        :images="[
                          { src: location.firstImage, alt: '', caption: '' },
                        ]"
                        :title="location.title"
                      >
                        <Button
                          variant="link"
                          class="inline gap-0 p-0 text-blue-500 text-xs"
                        >
                          상세보기
                        </Button>
                      </AttractionDialog>
                      <p
                        v-if="location.tel !== ''"
                        class="text-muted-foreground"
                      >
                        ·
                      </p>
                      <p class="text-xs text-blue-500">{{ location.tel }}</p>
                    </div>
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
