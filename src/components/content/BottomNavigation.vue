<script setup>
import { Button } from '@/components/ui/button/index.js'
import { Map, Home, MapPinned } from 'lucide-vue-next'

// 부모로부터 받는 props 정의
defineProps({
  activeMenu: {
    type: String,
    required: true,
  },
  setActiveMenu: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
    <ul class="flex justify-around items-center h-16">
      <li>
        <Button
          :variant="activeMenu === 'home' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center"
          @click="setActiveMenu('home')"
        >
          <Home class="h-5 w-5" />
          <span class="text-xs mt-1">홈</span>
        </Button>
      </li>
      <li>
        <Button
          :variant="activeMenu === 'map' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center"
          @click="setActiveMenu('map')"
        >
          <Map class="h-5 w-5" />
          <span class="text-xs mt-1">지도</span>
        </Button>
      </li>
      <li>
        <Button
          :variant="activeMenu === 'region' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center"
          @click="setActiveMenu('region')"
        >
          <MapPinned class="h-5 w-5" />
          <span class="text-xs mt-1">지역</span>
        </Button>
      </li>
      <li>
        <Button
          :variant="activeMenu === 'profile' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center"
          @click="setActiveMenu('profile')"
        >
          <img
            src="../../assets/no_picture.png"
            alt="User"
            class="w-10 h-10 rounded-full"
          />
        </Button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* 여기에 필요한 스타일을 추가할 수 있습니다 */
</style>
