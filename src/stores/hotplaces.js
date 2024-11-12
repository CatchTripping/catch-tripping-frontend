import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHotPlaces } from '@/api/hotplacesService.js'

export const useHotPlacesStore = defineStore('hotplaces', () => {
  const page = ref(1)
  const size = ref(8)
  const hotPlaceType = ref('Restaurant')
  const regionCode = ref(1)
  const sigunguCodes = ref([25, 2, 6])
  const places = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPlaces = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await fetchHotPlaces({
        page: page.value,
        size: size.value,
        hotPlaceType: hotPlaceType.value,
        regionCode: regionCode.value,
        sigunguCodes: sigunguCodes.value.join(',')
      })

      places.value = data
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    page,
    size,
    hotPlaceType,
    regionCode,
    sigunguCodes,
    places,
    loading,
    error,
    fetchPlaces
  }
})
