<script setup>
import { fetchCoursesDetail } from '@/api/coursesService.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate } from 'motion'
import {
  KakaoMap,
  KakaoMapMarker,
  KakaoMapCustomOverlay,
} from 'vue3-kakao-maps'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageOff, X } from 'lucide-vue-next'

const overlayContent = location => ` <div
        style="
          padding: 0.2em;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        "
      >
        <div style="font-weight: bold;">${location.subName}</div>
      </div>`

// 카카오맵 설정

const map = ref()
const onLoadKakaoMap = mapRef => {
  map.value = mapRef
  setBounds()
}

// Props
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  selectedCourse: {
    type: String,
    required: true,
  },
})

const courseDetail = ref(null)
const loading = ref(false)
const error = ref(null)

const updateCourse = async contentId => {
  loading.value = true
  error.value = null
  try {
    courseDetail.value = await fetchCoursesDetail(contentId)
  } catch (err) {
    console.error(err)
    error.value = err
  } finally {
    loading.value = false
  }
}

const setBounds = () => {
  // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
  const bounds = new kakao.maps.LatLngBounds()
  let point
  courseDetail.value.courseDetails.forEach(item => {
    if (item.mapy && item.mapx) {
      point = new kakao.maps.LatLng(item.mapy, item.mapx)
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(point)
    }
  })
  if (map.value !== undefined) {
    map.value.setBounds(bounds)
  }
}

// Emit
const emit = defineEmits(['update:selectedCourse'])

// 메소드 정의
const closeDetail = () => {
  emit('update:selectedCourse')
}

const animateVisibility = (el, duration = 0.3, delay = 0) => {
  if (el) {
    animate(el, { opacity: [0, 1] }, { duration, delay })
  }
}

const handlePopState = event => {
  event.preventDefault() // 기본 뒤로가기 동작을 막습니다.
  closeDetail()
}

// 컴포넌트가 마운트될 때
onMounted(() => {
  // 뒤로가기를 막음
  window.history.pushState(null, '', window.location.href)
  window.onpopstate = handlePopState

  if (props.course && props.course.contentId) {
    updateCourse(props.course.contentId)
  }
})

// 컴포넌트가 언마운트될 때
onBeforeUnmount(() => {
  // 뒤로가기 이벤트 리스너를 해제
  window.onpopstate = null
})
</script>
<template>
  <div
    v-if="props.selectedCourse === props.course.contentId"
    class="max-w-4xl mx-auto p-8"
  >
    <Button
      variant="ghost"
      size="icon"
      class="absolute top-4 right-4"
      @click="closeDetail"
    >
      <X class="h-6 w-6" />
    </Button>

    <!-- 타이틀-->
    <div :ref="el => animateVisibility(el)">
      <Badge variant="secondary" class="bg-red-500 text-white mb-1">코스</Badge>
      <h2 class="text-3xl font-bold mb-4">
        {{ props.course.title }}
      </h2>
    </div>

    <!-- 지역-->
    <div :ref="el => animateVisibility(el, 0.1, 0.1)">
      <p class="text-gray-600 mb-6">
        {{ props.course.sigunguName ? props.course.sigunguName : '' }}
      </p>
    </div>

    <!-- 사진-->
    <img
      v-if="props.course.firstImage"
      :src="props.course.firstImage"
      :alt="props.course.title"
      class="w-full object-cover mb-4"
      :ref="el => animateVisibility(el, 0.3, 0.3)"
    />
    <ImageOff
      v-else
      class="w-52 h-52 md:w-80 md:h-80 object-cover p-6 mb-4"
      color="gray"
      :ref="el => animateVisibility(el)"
    />

    <!-- 배지-->
    <div :ref="el => animateVisibility(el, 0.5, 0.5)">
      <h3 class="text-xl font-semibold mb-2">태그</h3>
      <div class="flex flex-wrap gap-2 mb-6">
        <Badge
          v-for="(place, index) in props.course.destinations"
          :key="index"
          variant="secondary"
        >
          {{ place }}
        </Badge>
      </div>
    </div>

    <!-- 코스 설명-->
    <div :ref="el => animateVisibility(el, 0.7, 0.7)">
      <h3 class="text-xl font-semibold mb-2">코스 설명</h3>
      <p class="text-gray-700 mb-6">
        {{ courseDetail !== null ? courseDetail.overview : '' }}
      </p>
      <KakaoMap
        v-if="courseDetail"
        class="mb-6"
        :width="'100%'"
        :lat="33.450701"
        :lng="126.570667"
        @onLoadKakaoMap="onLoadKakaoMap"
      >
        <template
          v-for="(location, index) in courseDetail.courseDetails"
          :key="location.subnum"
        >
          <KakaoMapMarker
            v-if="location.mapx && location.mapy"
            :lat="location.mapy"
            :lng="location.mapx"
            :clickable="true"
            :image="{
              imageSrc: '/src/assets/map/3/' + (index + 1) + '.png',
              imageWidth: 29,
              imageHeight: 50,
            }"
          />
          <KakaoMapCustomOverlay
            v-if="location.mapx && location.mapy"
            :lat="location.mapy"
            :lng="location.mapx"
            :content="overlayContent(location)"
            :yAnchor="2.6"
          />
        </template>
      </KakaoMap>
    </div>

    <!-- 서브 코스 내용-->
    <div class="relative">
      <div class="absolute left-[19px] top-0 bottom-0 w-px bg-gray-200"></div>
      <template v-if="courseDetail">
        <div
          v-for="(location, index) in courseDetail.courseDetails"
          :key="location.subContentId"
          class="relative mb-8"
        >
          <div class="flex items-start gap-8">
            <div
              class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center relative z-10"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <Card>
                <CardContent class="p-0">
                  <img
                    v-if="location.images.length >= 1"
                    :src="location.images[0].originimgurl"
                    :alt="location.images[0].imgname"
                    class="w-full object-cover rounded-t-lg"
                  />
                  <ImageOff
                    v-else
                    class="w-40 h-24 object-cover p-6"
                    color="gray"
                  />
                  <div class="p-4">
                    <h3 class="text-xl font-bold mb-2">
                      {{ location.subName }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      {{ location.subOverview }}
                    </p>
                    <div
                      v-if="location.images && location.images.length > 1"
                      class="grid grid-cols-3 gap-2 mt-4"
                    >
                      <img
                        v-for="(image, i) in location.images"
                        :key="i"
                        :src="image.smallimageurl"
                        :alt="`${location.name} ${i + 1}`"
                        width="150"
                        height="150"
                        class="w-full h-24 object-cover rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 스타일은 이곳에 추가 가능합니다 */
</style>
