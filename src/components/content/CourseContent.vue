<script setup>
import { computed, onMounted, ref, watch } from 'vue'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageOff, Loader2 } from 'lucide-vue-next'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchCoursesList } from '@/api/coursesService.js'
import { Card } from '@/components/ui/card/index.js'

import { animate } from 'motion'
import { cn } from '@/lib/utils.js'
import CourseDetail from '@/components/content/CourseDetail.vue'

const areas = [
  { code: 1, name: '서울' },
  { code: 2, name: '인천' },
  { code: 3, name: '대전' },
  { code: 4, name: '대구' },
  { code: 5, name: '광주' },
  { code: 6, name: '부산' },
  { code: 7, name: '울산' },
  { code: 8, name: '세종특별자치시' },
  { code: 31, name: '경기도' },
  { code: 32, name: '강원특별자치도' },
  { code: 33, name: '충청북도' },
  { code: 34, name: '충청남도' },
  { code: 35, name: '경상북도' },
  { code: 36, name: '경상남도' },
  { code: 37, name: '전북특별자치도' },
  { code: 38, name: '전라남도' },
  { code: 39, name: '제주도' },
]
const filteredAreas = computed(() => {
  const filterElement = areas.filter(item => item.code === areaCode.value)[0]
  if (filterElement) {
    return filterElement.name
  }
  return undefined
})

const areaCode = ref(null)
const sigunguCode = ref(null)
const page = ref(1)
const pageSize = ref(3)
const totalItems = ref(0)
const courses = ref([])
const selectedCourse = ref(null)
const loading = ref(false)
const error = ref(null)

const updateCoursesList = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await fetchCoursesList({
      page: page.value,
      pageSize: pageSize.value,
      areaCode: areaCode.value,
      sigunguCode: sigunguCode.value,
    })
    courses.value = data.courses
    totalItems.value = data.totalItems
  } catch (err) {
    console.error(err)
    error.value = err
  } finally {
    loading.value = false
  }
}

watch([areaCode, sigunguCode, page], () => {
  updateCoursesList()
})

onMounted(() => {
  updateCoursesList()
})
</script>
<template>
  <Card class="m-6 p-6 max-w-[900px] bg-background">
    <div class="flex items-center gap-2 mb-6">
      <div class="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
        추천
      </div>
      <h1 class="text-2xl font-bold">코스</h1>
    </div>
    <div v-if="loading" class="flex justify-center">
      <Loader2 size="100" color="#172341" class="animate-spin self-center" />
    </div>

    <div v-else class="flex flex-col-reverse lg:flex-row gap-6 max-w-7xl">
      <div class="flex-1 lg:w-[560px]">
        <div class="text-2xl font-bold mb-6">
          #{{ filteredAreas || '전체' }}
        </div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">총 {{ totalItems }}건</span>
          </div>
        </div>
        <!-- Content before Pagination -->
        <div
          v-for="course in courses"
          :key="course.contentId"
          :class="
            cn(
              '',
              selectedCourse === course.contentId
                ? 'fixed inset-0 z-50 bg-white overflow-auto'
                : '',
            )
          "
          :ref="
            el => {
              if (el) {
                animate(el, { opacity: [1, 1] }, { duration: 0.3 })
              }
            }
          "
        >
          <CourseDetail
            v-if="selectedCourse === course.contentId"
            :selected-course="selectedCourse"
            :course="course"
            @update:selectedCourse="selectedCourse = null"
          ></CourseDetail>
          <template v-else>
            <div class="border rounded-lg p-4 mb-4">
              <div class="flex items-start justify-between gap-2">
                <img
                  v-if="course.firstImage"
                  :src="course.firstImage"
                  :alt="course.title"
                  class="w-40 h-24 object-cover"
                />
                <ImageOff
                  v-else
                  class="w-40 h-24 object-cover p-6"
                  color="gray"
                />
                <div class="flex-1">
                  <h3
                    class="text-lg font-semibold mb-2 cursor-pointer hover:underline"
                    @click="selectedCourse = course.contentId"
                  >
                    {{ course.title }}
                  </h3>
                  <p class="text-sm text-gray-600 mb-2">
                    {{ course.sigunguName ? course.sigunguName : '' }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2 flex-wrap mt-2">
                <Badge
                  v-for="(place, index) in course.destinations"
                  :key="index"
                  variant="outline"
                  >{{ place }}
                </Badge>
              </div>
            </div>
          </template>
        </div>

        <!-- Pagination -->
        <Pagination
          class="pt-2 bg-background"
          v-model:page="page"
          :total="totalItems"
          :items-per-page="pageSize"
          show-edges
          :default-page="1"
        >
          <PaginationList
            v-slot="{ items }"
            class="flex justify-center items-center gap-1"
          >
            <PaginationFirst />
            <PaginationPrev />

            <!-- Page Numbers -->
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
      <div class="lg:w-72">
        <ScrollArea class="h-min">
          <div class="space-y-6 p-4">
            <div>
              <h3 class="font-semibold mb-3">지역</h3>
              <div class="flex flex-wrap gap-2">
                <Badge
                  :variant="null === areaCode ? 'default' : 'secondary'"
                  class="cursor-pointer"
                  @click="
                    () => {
                      areaCode = null
                      sigunguCode = null
                    }
                  "
                >
                  #전체
                </Badge>
                <Badge
                  v-for="{ code, name } in areas"
                  :key="code"
                  :variant="code === areaCode ? 'default' : 'secondary'"
                  class="cursor-pointer"
                  @click="
                    () => {
                      if (areaCode === code) {
                        areaCode = null
                        sigunguCode = null
                      } else {
                        areaCode = code
                        sigunguCode = null
                      }
                    }
                  "
                >
                  #{{ name }}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  </Card>
</template>
