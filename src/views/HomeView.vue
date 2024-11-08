<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown,  Settings, Map, Home, BarChart, ChevronLeft, User } from 'lucide-vue-next'
import Logo from '@/components/icon/MainLogo.vue'
import HomeContent from '@/components/HomeContent.vue'
import MapContent from '@/components/MapContent.vue'
import StatsContent from '@/components/StatsContent.vue'
import UsersContent from '@/components/UsersContent.vue'
import HelpContent from '@/components/HelpContent.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

// 상태 변수
const isCollapsed = ref(false)
const activeMenu = ref('home')

// 드롭다운 상태 관리
const isDropdownOpen = ref(false)

// 모바일 상태 관리
const isMobile = ref(false)

// 부모로부터 전달받을 함수
const setActiveMenu = (menu) => {
  activeMenu.value = menu
}

const setIsCollapsed = (collapsed) => {
  isCollapsed.value = collapsed
}

const setIsDropdownOpen = (state) => {
  isDropdownOpen.value = state
}

// 윈도우 크기 변경에 따라 사이드바 크기 조정
const handleResize = () => {
  isMobile.value = window.innerWidth < 640
  isCollapsed.value = window.innerWidth < 1024 && window.innerWidth >= 640
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // 초기 사이즈 체크
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- Sidebar for desktop and tablet -->
    <aside v-if="!isMobile" :class="['bg-white min-h-screen flex flex-col transition-all duration-300', isCollapsed ? 'w-16' : 'w-64', 'relative']">
      <div :class="['p-4 border-b flex items-center', isCollapsed ? 'justify-center' : 'justify-start']">
        <Logo v-if="isCollapsed" />
        <h1 v-else class="text-2xl font-bold">CatchTrip</h1>
      </div>
      <nav class="flex-grow">
        <ul class="p-2 space-y-2">
          <li>
            <Button :variant="activeMenu === 'home' ? 'secondary' : 'ghost'" class="w-full justify-start" @click="setActiveMenu('home')">
              <Home class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">홈</span>
            </Button>
          </li>
          <li>
            <Button :variant="activeMenu === 'map' ? 'secondary' : 'ghost'" class="w-full justify-start" @click="setActiveMenu('map')">
              <Map class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">지도</span>
            </Button>
          </li>
          <li>
            <Button :variant="activeMenu === 'stats' ? 'secondary' : 'ghost'" class="w-full justify-start" @click="setActiveMenu('stats')">
              <BarChart class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">통계</span>
            </Button>
          </li>
          <li>
            <Button :variant="activeMenu === 'profile' ? 'secondary' : 'ghost'" class="w-full justify-start" @click="setActiveMenu('profile')">
              <User class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">프로필</span>
            </Button>
          </li>
        </ul>
      </nav>
      <div :class="['p-4 border-t', isCollapsed ? 'flex justify-center' : '']">
        <DropdownMenu @update:open="setIsDropdownOpen">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" class="w-full justify-start p-0">
              <img src="@/assets/placeholder.svg?height=32&width=32" alt="User" class="w-8 h-8 rounded-full" />
              <template v-if="!isCollapsed" >
                <span class="ml-2">사용자 이름</span>
                <ChevronDown :class="['ml-auto h-4 w-4 transition-transform duration-300', isDropdownOpen ? 'rotate-180' : '']" />
              </template>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56" :align="isCollapsed ? 'end' : 'start'" :align-offset="isCollapsed ? -8 : 0">
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>프로필</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
            <DropdownMenuItem>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-md"
        @click="setIsCollapsed(!isCollapsed)"
      >
        <ChevronLeft :class="['h-4 w-4 transition-transform duration-300', isCollapsed ? 'rotate-180' : '']" />
      </Button>
    </aside>

    <!-- Main Content -->
    <div class="flex-grow flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm p-4 flex items-center justify-between flex-shrink-0">
        <h1 class="text-xl font-semibold">CatchTrip</h1>
        <div class="flex items-center space-x-2">
          <Button size="icon" variant="ghost">
            <Bell class="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings class="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>설정</DropdownMenuItem>
              <DropdownMenuItem>테마</DropdownMenuItem>
              <DropdownMenuItem>언어</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <!-- Scrollable Content -->
      <main :class="['flex-grow p-6 overflow-auto bg-gray-100 space-y-6', isMobile ? 'pb-20' : '']">
        <component
          :is="
            activeMenu === 'home'
              ? HomeContent
              : activeMenu === 'map'
                ? MapContent
                : activeMenu === 'stats'
                  ? StatsContent
                  : activeMenu === 'users'
                    ? UsersContent
                    : activeMenu === 'help'
                      ? HelpContent
                      : HomeContent
          "
        />
      </main>

      <!-- Bottom Navigation for mobile -->
      <BottomNavigation
        v-if="isMobile"
        :activeMenu="activeMenu"
        :setActiveMenu="setActiveMenu"
      />
    </div>
  </div>
</template>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다 */
</style>
