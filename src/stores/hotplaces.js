import { defineStore } from 'pinia'
import { fetchHotPlaces } from '@/api/hotplacesService.js'
import { debounce } from 'lodash'
import SeoulMap from '@/components/map/SeoulMap.vue'
import IncheonMap from '@/components/map/IncheonMap.vue'
import DaejeonMap from '@/components/map/DaejeonMap.vue'
import DaeguMap from '@/components/map/DaeguMap.vue'
import GwangjuMap from '@/components/map/GwangjuMap.vue'
import BusanMap from '@/components/map/BusanMap.vue'
import UlsanMap from '@/components/map/UlsanMap.vue'
import SejongMap from '@/components/map/SejongMap.vue'
import GyeonggiMap from '@/components/map/GyeonggiMap.vue'
import GangwonMap from '@/components/map/GangwonMap.vue'
import ChungbukMap from '@/components/map/ChungbukMap.vue'
import ChungnamMap from '@/components/map/ChungnamMap.vue'
import GyeongbukMap from '@/components/map/GyeongbukMap.vue'
import GyeongnamMap from '@/components/map/GyeongnamMap.vue'
import JeonbukMap from '@/components/map/JeonbukMap.vue'
import JeonnamMap from '@/components/map/JeonnamMap.vue'
import JejuMap from '@/components/map/JejuMap.vue'

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
          return SeoulMap
        case 2:
          return IncheonMap
        case 3:
          return DaejeonMap
        case 4:
          return DaeguMap
        case 5:
          return GwangjuMap
        case 6:
          return BusanMap
        case 7:
          return UlsanMap
        case 8:
          return SejongMap
        case 31:
          return GyeonggiMap
        case 32:
          return GangwonMap
        case 33:
          return ChungbukMap
        case 34:
          return ChungnamMap
        case 35:
          return GyeongbukMap
        case 36:
          return GyeongnamMap
        case 37:
          return JeonbukMap
        case 38:
          return JeonnamMap
        case 39:
          return JejuMap
        default:
          return SeoulMap
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
