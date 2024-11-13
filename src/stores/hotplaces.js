import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { fetchHotPlaces } from '@/api/hotplacesService.js'
import { debounce } from 'lodash'
import SeoulMap from '@/components/map/SeoulMap.vue'

export const useHotPlacesStore = defineStore('hotplaces', () => {
  const page = ref(1)
  const size = ref(8)
  const hotPlaceType = ref('Restaurant')
  const regionCode = ref(1)
  const sigunguCodes = ref([])
  const places = ref([])
  const loading = ref(false)
  const error = ref(null)

  const renderMap = computed(() => {
    switch (regionCode.value) {
      case '1':
        return SeoulMap
      default:
        return SeoulMap
    }
  })

  const handleClick = event => {
    if (loading.value) return // loading이 true일 경우 지역 변경 하지 않음
    loading.value = true

    // 클릭된 요소의 ID 값을 가져옵니다
    const sigunguCode = parseInt(event.target.dataset.sigunguCode, 10)

    // 클릭된 요소에 st2 클래스 토글
    const toggled = event.target.classList.toggle('st2')

    // sigunguCodes 배열에 sigunguCode 추가하거나 제거
    if (toggled) {
      // 추가 (새로운 배열로 할당)
      if (!sigunguCodes.value.includes(sigunguCode)) {
        sigunguCodes.value = [...sigunguCodes.value, sigunguCode]
      }
    } else {
      // 제거 (새로운 배열로 할당)
      sigunguCodes.value = sigunguCodes.value.filter(
        code => code !== sigunguCode,
      )
    }
  }

  const fetchPlaces = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await fetchHotPlaces({
        page: page.value,
        offset: size.value,
        hotPlaceType: hotPlaceType.value,
        regionCode: regionCode.value,
        sigunguCodes: sigunguCodes.value.join(','),
      })

      places.value = data
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 디바운싱 처리된 fetchPlaces 호출
  const debouncedFetchPlaces = debounce(fetchPlaces, 500)

  // 상태 값 변경 시 자동 호출되는 watch
  watch([hotPlaceType, regionCode, sigunguCodes], () => {
    debouncedFetchPlaces() // 상태 변경 시 디바운싱된 fetchPlaces 호출
  })

  return {
    page,
    size,
    hotPlaceType,
    regionCode,
    sigunguCodes,
    places,
    loading,
    error,
    renderMap,
    handleClick,
    fetchPlaces,
  }
})
