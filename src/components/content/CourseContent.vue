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
import { ImageOff, Loader2, MoreVertical } from 'lucide-vue-next'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchCoursesList } from '@/api/coursesService.js'
// import { debounce } from 'lodash'
import { Card } from '@/components/ui/card/index.js'

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
// const sigungues = [
//   { code: 1, scode: 1, sname: '강남구' },
//   { code: 1, scode: 2, sname: '강동구' },
//   { code: 1, scode: 3, sname: '강북구' },
//   { code: 1, scode: 4, sname: '강서구' },
//   { code: 1, scode: 5, sname: '관악구' },
//   { code: 1, scode: 6, sname: '광진구' },
//   { code: 1, scode: 7, sname: '구로구' },
//   { code: 1, scode: 8, sname: '금천구' },
//   { code: 1, scode: 9, sname: '노원구' },
//   { code: 1, scode: 10, sname: '도봉구' },
//   { code: 1, scode: 11, sname: '동대문구' },
//   { code: 1, scode: 12, sname: '동작구' },
//   { code: 1, scode: 13, sname: '마포구' },
//   { code: 1, scode: 14, sname: '서대문구' },
//   { code: 1, scode: 15, sname: '서초구' },
//   { code: 1, scode: 16, sname: '성동구' },
//   { code: 1, scode: 17, sname: '성북구' },
//   { code: 1, scode: 18, sname: '송파구' },
//   { code: 1, scode: 19, sname: '양천구' },
//   { code: 1, scode: 20, sname: '영등포구' },
//   { code: 1, scode: 21, sname: '용산구' },
//   { code: 1, scode: 22, sname: '은평구' },
//   { code: 1, scode: 23, sname: '종로구' },
//   { code: 1, scode: 24, sname: '중구' },
//   { code: 1, scode: 25, sname: '중랑구' },
//   { code: 2, scode: 1, sname: '강화군' },
//   { code: 2, scode: 2, sname: '계양구' },
//   { code: 2, scode: 3, sname: '미추홀구' },
//   { code: 2, scode: 4, sname: '남동구' },
//   { code: 2, scode: 5, sname: '동구' },
//   { code: 2, scode: 6, sname: '부평구' },
//   { code: 2, scode: 7, sname: '서구' },
//   { code: 2, scode: 8, sname: '연수구' },
//   { code: 2, scode: 9, sname: '옹진군' },
//   { code: 2, scode: 10, sname: '중구' },
//   { code: 3, scode: 1, sname: '대덕구' },
//   { code: 3, scode: 2, sname: '동구' },
//   { code: 3, scode: 3, sname: '서구' },
//   { code: 3, scode: 4, sname: '유성구' },
//   { code: 3, scode: 5, sname: '중구' },
//   { code: 4, scode: 1, sname: '남구' },
//   { code: 4, scode: 2, sname: '달서구' },
//   { code: 4, scode: 3, sname: '달성군' },
//   { code: 4, scode: 4, sname: '동구' },
//   { code: 4, scode: 5, sname: '북구' },
//   { code: 4, scode: 6, sname: '서구' },
//   { code: 4, scode: 7, sname: '수성구' },
//   { code: 4, scode: 8, sname: '중구' },
//   { code: 4, scode: 9, sname: '군위군' },
//   { code: 5, scode: 1, sname: '광산구' },
//   { code: 5, scode: 2, sname: '남구' },
//   { code: 5, scode: 3, sname: '동구' },
//   { code: 5, scode: 4, sname: '북구' },
//   { code: 5, scode: 5, sname: '서구' },
//   { code: 6, scode: 1, sname: '강서구' },
//   { code: 6, scode: 2, sname: '금정구' },
//   { code: 6, scode: 3, sname: '기장군' },
//   { code: 6, scode: 4, sname: '남구' },
//   { code: 6, scode: 5, sname: '동구' },
//   { code: 6, scode: 6, sname: '동래구' },
//   { code: 6, scode: 7, sname: '부산진구' },
//   { code: 6, scode: 8, sname: '북구' },
//   { code: 6, scode: 9, sname: '사상구' },
//   { code: 6, scode: 10, sname: '사하구' },
//   { code: 6, scode: 11, sname: '서구' },
//   { code: 6, scode: 12, sname: '수영구' },
//   { code: 6, scode: 13, sname: '연제구' },
//   { code: 6, scode: 14, sname: '영도구' },
//   { code: 6, scode: 15, sname: '중구' },
//   { code: 6, scode: 16, sname: '해운대구' },
//   { code: 7, scode: 1, sname: '중구' },
//   { code: 7, scode: 2, sname: '남구' },
//   { code: 7, scode: 3, sname: '동구' },
//   { code: 7, scode: 4, sname: '북구' },
//   { code: 7, scode: 5, sname: '울주군' },
//   { code: 8, scode: 1, sname: '세종특별자치시' },
//   { code: 31, scode: 1, sname: '가평군' },
//   { code: 31, scode: 2, sname: '고양시' },
//   { code: 31, scode: 3, sname: '과천시' },
//   { code: 31, scode: 4, sname: '광명시' },
//   { code: 31, scode: 5, sname: '광주시' },
//   { code: 31, scode: 6, sname: '구리시' },
//   { code: 31, scode: 7, sname: '군포시' },
//   { code: 31, scode: 8, sname: '김포시' },
//   { code: 31, scode: 9, sname: '남양주시' },
//   { code: 31, scode: 10, sname: '동두천시' },
//   { code: 31, scode: 11, sname: '부천시' },
//   { code: 31, scode: 12, sname: '성남시' },
//   { code: 31, scode: 13, sname: '수원시' },
//   { code: 31, scode: 14, sname: '시흥시' },
//   { code: 31, scode: 15, sname: '안산시' },
//   { code: 31, scode: 16, sname: '안성시' },
//   { code: 31, scode: 17, sname: '안양시' },
//   { code: 31, scode: 18, sname: '양주시' },
//   { code: 31, scode: 19, sname: '양평군' },
//   { code: 31, scode: 20, sname: '여주시' },
//   { code: 31, scode: 21, sname: '연천군' },
//   { code: 31, scode: 22, sname: '오산시' },
//   { code: 31, scode: 23, sname: '용인시' },
//   { code: 31, scode: 24, sname: '의왕시' },
//   { code: 31, scode: 25, sname: '의정부시' },
//   { code: 31, scode: 26, sname: '이천시' },
//   { code: 31, scode: 27, sname: '파주시' },
//   { code: 31, scode: 28, sname: '평택시' },
//   { code: 31, scode: 29, sname: '포천시' },
//   { code: 31, scode: 30, sname: '하남시' },
//   { code: 31, scode: 31, sname: '화성시' },
//   { code: 32, scode: 1, sname: '강릉시' },
//   { code: 32, scode: 2, sname: '고성군' },
//   { code: 32, scode: 3, sname: '동해시' },
//   { code: 32, scode: 4, sname: '삼척시' },
//   { code: 32, scode: 5, sname: '속초시' },
//   { code: 32, scode: 6, sname: '양구군' },
//   { code: 32, scode: 7, sname: '양양군' },
//   { code: 32, scode: 8, sname: '영월군' },
//   { code: 32, scode: 9, sname: '원주시' },
//   { code: 32, scode: 10, sname: '인제군' },
//   { code: 32, scode: 11, sname: '정선군' },
//   { code: 32, scode: 12, sname: '철원군' },
//   { code: 32, scode: 13, sname: '춘천시' },
//   { code: 32, scode: 14, sname: '태백시' },
//   { code: 32, scode: 15, sname: '평창군' },
//   { code: 32, scode: 16, sname: '홍천군' },
//   { code: 32, scode: 17, sname: '화천군' },
//   { code: 32, scode: 18, sname: '횡성군' },
//   { code: 33, scode: 1, sname: '괴산군' },
//   { code: 33, scode: 2, sname: '단양군' },
//   { code: 33, scode: 3, sname: '보은군' },
//   { code: 33, scode: 4, sname: '영동군' },
//   { code: 33, scode: 5, sname: '옥천군' },
//   { code: 33, scode: 6, sname: '음성군' },
//   { code: 33, scode: 7, sname: '제천시' },
//   { code: 33, scode: 8, sname: '진천군' },
//   { code: 33, scode: 9, sname: '청원군' },
//   { code: 33, scode: 10, sname: '청주시' },
//   { code: 33, scode: 11, sname: '충주시' },
//   { code: 33, scode: 12, sname: '증평군' },
//   { code: 34, scode: 1, sname: '공주시' },
//   { code: 34, scode: 2, sname: '금산군' },
//   { code: 34, scode: 3, sname: '논산시' },
//   { code: 34, scode: 4, sname: '당진시' },
//   { code: 34, scode: 5, sname: '보령시' },
//   { code: 34, scode: 6, sname: '부여군' },
//   { code: 34, scode: 7, sname: '서산시' },
//   { code: 34, scode: 8, sname: '서천군' },
//   { code: 34, scode: 9, sname: '아산시' },
//   { code: 34, scode: 11, sname: '예산군' },
//   { code: 34, scode: 12, sname: '천안시' },
//   { code: 34, scode: 13, sname: '청양군' },
//   { code: 34, scode: 14, sname: '태안군' },
//   { code: 34, scode: 15, sname: '홍성군' },
//   { code: 34, scode: 16, sname: '계룡시' },
//   { code: 35, scode: 1, sname: '경산시' },
//   { code: 35, scode: 2, sname: '경주시' },
//   { code: 35, scode: 3, sname: '고령군' },
//   { code: 35, scode: 4, sname: '구미시' },
//   { code: 35, scode: 6, sname: '김천시' },
//   { code: 35, scode: 7, sname: '문경시' },
//   { code: 35, scode: 8, sname: '봉화군' },
//   { code: 35, scode: 9, sname: '상주시' },
//   { code: 35, scode: 10, sname: '성주군' },
//   { code: 35, scode: 11, sname: '안동시' },
//   { code: 35, scode: 12, sname: '영덕군' },
//   { code: 35, scode: 13, sname: '영양군' },
//   { code: 35, scode: 14, sname: '영주시' },
//   { code: 35, scode: 15, sname: '영천시' },
//   { code: 35, scode: 16, sname: '예천군' },
//   { code: 35, scode: 17, sname: '울릉군' },
//   { code: 35, scode: 18, sname: '울진군' },
//   { code: 35, scode: 19, sname: '의성군' },
//   { code: 35, scode: 20, sname: '청도군' },
//   { code: 35, scode: 21, sname: '청송군' },
//   { code: 35, scode: 22, sname: '칠곡군' },
//   { code: 35, scode: 23, sname: '포항시' },
//   { code: 36, scode: 1, sname: '거제시' },
//   { code: 36, scode: 2, sname: '거창군' },
//   { code: 36, scode: 3, sname: '고성군' },
//   { code: 36, scode: 4, sname: '김해시' },
//   { code: 36, scode: 5, sname: '남해군' },
//   { code: 36, scode: 6, sname: '마산시' },
//   { code: 36, scode: 7, sname: '밀양시' },
//   { code: 36, scode: 8, sname: '사천시' },
//   { code: 36, scode: 9, sname: '산청군' },
//   { code: 36, scode: 10, sname: '양산시' },
//   { code: 36, scode: 12, sname: '의령군' },
//   { code: 36, scode: 13, sname: '진주시' },
//   { code: 36, scode: 14, sname: '진해시' },
//   { code: 36, scode: 15, sname: '창녕군' },
//   { code: 36, scode: 16, sname: '창원시' },
//   { code: 36, scode: 17, sname: '통영시' },
//   { code: 36, scode: 18, sname: '하동군' },
//   { code: 36, scode: 19, sname: '함안군' },
//   { code: 36, scode: 20, sname: '함양군' },
//   { code: 36, scode: 21, sname: '합천군' },
//   { code: 37, scode: 1, sname: '고창군' },
//   { code: 37, scode: 2, sname: '군산시' },
//   { code: 37, scode: 3, sname: '김제시' },
//   { code: 37, scode: 4, sname: '남원시' },
//   { code: 37, scode: 5, sname: '무주군' },
//   { code: 37, scode: 6, sname: '부안군' },
//   { code: 37, scode: 7, sname: '순창군' },
//   { code: 37, scode: 8, sname: '완주군' },
//   { code: 37, scode: 9, sname: '익산시' },
//   { code: 37, scode: 10, sname: '임실군' },
//   { code: 37, scode: 11, sname: '장수군' },
//   { code: 37, scode: 12, sname: '전주시' },
//   { code: 37, scode: 13, sname: '정읍시' },
//   { code: 37, scode: 14, sname: '진안군' },
//   { code: 38, scode: 1, sname: '강진군' },
//   { code: 38, scode: 2, sname: '고흥군' },
//   { code: 38, scode: 3, sname: '곡성군' },
//   { code: 38, scode: 4, sname: '광양시' },
//   { code: 38, scode: 5, sname: '구례군' },
//   { code: 38, scode: 6, sname: '나주시' },
//   { code: 38, scode: 7, sname: '담양군' },
//   { code: 38, scode: 8, sname: '목포시' },
//   { code: 38, scode: 9, sname: '무안군' },
//   { code: 38, scode: 10, sname: '보성군' },
//   { code: 38, scode: 11, sname: '순천시' },
//   { code: 38, scode: 12, sname: '신안군' },
//   { code: 38, scode: 13, sname: '여수시' },
//   { code: 38, scode: 16, sname: '영광군' },
//   { code: 38, scode: 17, sname: '영암군' },
//   { code: 38, scode: 18, sname: '완도군' },
//   { code: 38, scode: 19, sname: '장성군' },
//   { code: 38, scode: 20, sname: '장흥군' },
//   { code: 38, scode: 21, sname: '진도군' },
//   { code: 38, scode: 22, sname: '함평군' },
//   { code: 38, scode: 23, sname: '해남군' },
//   { code: 38, scode: 24, sname: '화순군' },
//   { code: 39, scode: 1, sname: '남제주군' },
//   { code: 39, scode: 2, sname: '북제주군' },
//   { code: 39, scode: 3, sname: '서귀포시' },
//   { code: 39, scode: 4, sname: '제주시' },
// ]
// const filteredSigungues = computed(() => {
//   return sigungues.filter(item => item.code === areaCode.value)
// })

const areaCode = ref(null)
const sigunguCode = ref(null)
const page = ref(1)
const pageSize = ref(3)
const totalItems = ref(0)
const courses = ref([])
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
        <div class="space-y-4">
          <div
            v-for="course in courses"
            :key="course.contentId"
            class="border rounded-lg p-4"
          >
            <div class="flex items-start justify-between gap-2">
              <img
                v-if="course.firstImage"
                :src="course.firstImage"
                :alt="course.title"
                class="w-40 h-24 object-cover"
              />
              <ImageOff
                v-else
                class="w-40 h-24 object-cover  p-6"
                color="gray"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold mb-2">{{ course.title }}</h3>
                <p class="text-sm text-gray-600 mb-2">
                  {{ course.sigunguName ? course.sigunguName : '' }}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical class="h-4 w-4" />
              </Button>
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
        </div>

        <!-- Pagination -->
        <Pagination
          class="pt-6 bg-background"
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
            <!--시군구 필터-->
            <!--          <div v-if="areaCode">-->
            <!--            <h3 class="font-semibold mb-3">시군구</h3>-->
            <!--            <div class="grid grid-cols-2 gap-2">-->
            <!--              <Badge-->
            <!--                :variant="null === sigunguCode ? 'default' : 'secondary'"-->
            <!--                class="cursor-pointer justify-center"-->
            <!--                @click="-->
            <!--                  () => {-->
            <!--                    sigunguCode = null-->
            <!--                  }-->
            <!--                "-->
            <!--              >-->
            <!--                #전체-->
            <!--              </Badge>-->
            <!--              <Badge-->
            <!--                v-for="{ scode, sname } in filteredSigungues"-->
            <!--                :key="scode"-->
            <!--                :variant="scode === sigunguCode ? 'default' : 'secondary'"-->
            <!--                class="cursor-pointer justify-center"-->
            <!--                @click="-->
            <!--                  () => {-->
            <!--                    if (sigunguCode === scode) {-->
            <!--                      sigunguCode = null-->
            <!--                    } else {-->
            <!--                      sigunguCode = scode-->
            <!--                    }-->
            <!--                  }-->
            <!--                "-->
            <!--              >-->
            <!--                #{{ sname }}-->
            <!--              </Badge>-->
            <!--            </div>-->
            <!--          </div>-->
          </div>
        </ScrollArea>
      </div>
    </div>
  </Card>
</template>
