import { defineStore } from 'pinia'
import { fetchHotPlaces } from '@/api/hotplacesService.js'
import { debounce } from 'lodash'
import { defineAsyncComponent } from 'vue'

export const useHotPlacesStore = defineStore('hotplaces', {
  state: () => ({
    page: 1,
    size: 8,
    hotPlaceType: 'Restaurant',
    regionCode: 1,
    sigunguCodes: [],
    places: [],
    loading: false,
    error: null,
  }),

  getters: {
    renderMap(state) {
      switch (state.regionCode) {
        case 1:
          return defineAsyncComponent(
            () => import('@/components/map/SeoulMap.vue'),
          )
        case 2:
          return defineAsyncComponent(
            () => import('@/components/map/IncheonMap.vue'),
          )
        case 3:
          return defineAsyncComponent(
            () => import('@/components/map/DaejeonMap.vue'),
          )
        case 4:
          return defineAsyncComponent(
            () => import('@/components/map/DaeguMap.vue'),
          )
        case 5:
          return defineAsyncComponent(
            () => import('@/components/map/GwangjuMap.vue'),
          )
        case 6:
          return defineAsyncComponent(
            () => import('@/components/map/BusanMap.vue'),
          )
        case 7:
          return defineAsyncComponent(
            () => import('@/components/map/UlsanMap.vue'),
          )
        case 8:
          return defineAsyncComponent(
            () => import('@/components/map/SejongMap.vue'),
          )
        case 31:
          return defineAsyncComponent(
            () => import('@/components/map/GyeonggiMap.vue'),
          )
        case 32:
          return defineAsyncComponent(
            () => import('@/components/map/GangwonMap.vue'),
          )
        case 33:
          return defineAsyncComponent(
            () => import('@/components/map/ChungbukMap.vue'),
          )
        case 34:
          return defineAsyncComponent(
            () => import('@/components/map/ChungnamMap.vue'),
          )
        case 35:
          return defineAsyncComponent(
            () => import('@/components/map/GyeongbukMap.vue'),
          )
        case 36:
          return defineAsyncComponent(
            () => import('@/components/map/GyeongnamMap.vue'),
          )
        case 37:
          return defineAsyncComponent(
            () => import('@/components/map/JeonbukMap.vue'),
          )
        case 38:
          return defineAsyncComponent(
            () => import('@/components/map/JeonnamMap.vue'),
          )
        case 39:
          return defineAsyncComponent(
            () => import('@/components/map/JejuMap.vue'),
          )
        default:
          return defineAsyncComponent(
            () => import('@/components/map/SeoulMap.vue'),
          )
      }
    },
  },

  actions: {
    setAreaCode(areaCode) {
      if (this.regionCode !== areaCode) {
        this.sigunguCodes = []
        this.regionCode = areaCode
      }
    },

    // handleClick: 지역 선택 처리
    handleClick(event) {
      if (this.loading) return // loading 이 true 일 경우 지역 변경 하지 않음
      this.loading = true

      // 클릭된 요소의 ID 값을 가져옵  니다
      let dataCode = event.target.dataset.sigunguCode
      let toggled
      if (dataCode === undefined) {
        dataCode = event.target.parentElement.dataset.sigunguCode
        // 클릭된 요소에 st2 클래스 토글
        toggled = event.target.parentElement.classList.toggle('st2')
      } else {
        // 클릭된 요소에 st2 클래스 토글
        toggled = event.target.classList.toggle('st2')
      }
      const sigunguCode = parseInt(dataCode, 10)

      // sigunguCodes 배열에 sigunguCode 추가하거나 제거
      if (toggled) {
        // 추가 (새로운 배열로 할당)
        if (!this.sigunguCodes.includes(sigunguCode)) {
          this.sigunguCodes = [...this.sigunguCodes, sigunguCode]
        }
      } else {
        // 제거 (새로운 배열로 할당)
        this.sigunguCodes = this.sigunguCodes.filter(
          code => code !== sigunguCode,
        )
      }
    },

    // fetchPlaces: 핫플레이스 데이터를 가져오는 함수
    async fetchPlaces() {
      this.loading = true
      this.error = null
      try {
        this.places = await fetchHotPlaces({
          page: this.page,
          offset: this.size,
          hotPlaceType: this.hotPlaceType,
          regionCode: this.regionCode,
          sigunguCodes: this.sigunguCodes.join(','),
        })
      } catch (err) {
        console.error(err)
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 디바운싱 처리된 fetchPlaces 호출
    debouncedFetchPlaces: debounce(function () {
      this.fetchPlaces()
    }, 500),
  },

  // 초기화 및 상태 변경 시 디바운싱된 fetchPlaces 호출
  created() {
    this.debouncedFetchPlaces()
  },
})
