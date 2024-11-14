<script setup>
import { Button } from '@/components/ui/button/index.js'
import { Map, Home, MapPinned, UserRound } from 'lucide-vue-next'

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
      <li class="flex-1 flex justify-center">
        <Button
          :variant="activeMenu === 'home' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center w-full h-16 p-0"
          @click="setActiveMenu('home')"
        >
          <Home />
          <span class="text-xs">홈</span>
        </Button>
      </li>
      <li class="flex-1 flex justify-center">
        <Button
          :variant="activeMenu === 'map' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center w-full h-16 p-0"
          @click="setActiveMenu('map')"
        >
          <Map />
          <span class="text-xs">지도</span>
        </Button>
      </li>
      <li class="flex-1 flex justify-center">
        <Button
          :variant="activeMenu === 'region' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center w-full h-16 p-0"
          @click="setActiveMenu('region')"
        >
          <MapPinned />
          <span class="text-xs">지역</span>
        </Button>
      </li>
      <li class="flex-1 flex justify-center">
        <Button
          :variant="activeMenu === 'profile' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center w-full h-16 p-0"
          @click="setActiveMenu('profile')"
        >
          <UserRound />
          <span class="text-xs">프로필</span>
        </Button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* 여기에 필요한 스타일을 추가할 수 있습니다 */
</style>
