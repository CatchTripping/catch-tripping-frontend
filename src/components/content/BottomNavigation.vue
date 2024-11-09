<script setup>
import { Button } from '@/components/ui/button/index.js'
import { Map, Home, BarChart } from 'lucide-vue-next'

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
          :variant="activeMenu === 'stats' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center"
          @click="setActiveMenu('stats')"
        >
          <BarChart class="h-5 w-5" />
          <span class="text-xs mt-1">통계</span>
        </Button>
      </li>
      <li>
        <Button
          :variant="activeMenu === 'profile' ? 'secondary' : 'ghost'"
          class="flex flex-col items-center"
          @click="setActiveMenu('profile')"
        >
          <img
            src="../../assets/placeholder.svg?height=32&width=32"
            alt="User"
            class="w-8 h-8 rounded-full"
          />
        </Button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* 여기에 필요한 스타일을 추가할 수 있습니다 */
</style>
