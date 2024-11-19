import { defineStore } from 'pinia'
import { fetchNearby } from '@/api/mapsService.js'
import { debounce } from 'lodash'

export const useMapStore = defineStore('maps', {
  state: () => ({
    latitude: 37.509372, // 현재 위치 위도
    longitude: 126.80646, // 현재 위치 경도
    page: 1, // 현재 페이지
    pageSize: 5, // 페이지 당 아이템 개수
    totalItems: 0, // 전체 아이템 수
    attractions: [],
    loading: false,
    error: null,
    visibleIndex: -1,
    visibleInfo: -1,
  }),

  getters: {},

  actions: {
    async fetchMaps() {
      this.loading = true
      this.error = null
      try {
        const nearby = await fetchNearby({
          page: this.page,
          pageSize: this.pageSize,
          distance: 1,
          latitude: this.latitude,
          longitude: this.longitude,
        })
        this.attractions = nearby.attractions
        this.totalItems = nearby.totalItems
      } catch (err) {
        console.error(err)
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // 디바운싱 처리된 fetchMaps 호출
    debouncedFetchMaps: debounce(async function () {
      await this.fetchMaps()
    }, 500),
  },

  create() {
    this.debouncedFetchMaps()
  },
})
