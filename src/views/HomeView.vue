<!--v23-->
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Users,
  Settings,
  Map,
  MapPinned,
  Home,
  BarChart,
  HelpCircle,
  ChevronLeft,
} from 'lucide-vue-next'
import Logo from '@/components/icon/MainLogo.vue'
import HomeContent from '@/components/content/HomeContent.vue'
import MapContent from '@/components/content/MapContent.vue'
import StatsContent from '@/components/content/StatsContent.vue'
import UsersContent from '@/components/content/UsersContent.vue'
import HelpContent from '@/components/content/HelpContent.vue'
import BottomNavigation from '@/components/content/BottomNavigation.vue'
import ProfileContent from '@/components/content/ProfileContent.vue'
import NotificationsContent from '@/components/content/NotificationsContent.vue'
import SettingsContent from '@/components/content/SettingsContent.vue'
import RegionContent from '@/components/content/RegionContent.vue'
import { useUserStore } from '@/stores/user'

// 유저 정보 및 로그아웃 함수 정의
const userStore = useUserStore()
const userInfo = userStore.userInfo // userInfo 상태 가져오기

// 상태 변수
const isCollapsed = ref(false)
const activeMenu = ref('home')
const isMobile = ref(false)

const renderContent = computed(() => {
  switch (activeMenu.value) {
    case 'home':
      return HomeContent
    case 'map':
      return MapContent
    case 'region':
      return RegionContent
    case 'stats':
      return StatsContent
    case 'profile':
      return ProfileContent
    case 'users':
      return UsersContent
    case 'notifications':
      return NotificationsContent
    case 'settings':
      return SettingsContent
    case 'help':
      return HelpContent

    default:
      return HomeContent
  }
})

const setIsCollapsed = collapsed => {
  isCollapsed.value = collapsed
}

const setActiveMenu = menu => {
  activeMenu.value = menu
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
    <aside
      v-if="!isMobile"
      :class="[
        'bg-white min-h-screen flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-56',
        'relative',
      ]"
    >
      <div
        :class="[
          'p-4 border-b flex items-center',
          isCollapsed ? 'justify-center' : 'justify-start',
        ]"
      >
        <Logo v-if="isCollapsed" />
        <h1 v-else class="text-2xl font-bold">CatchTrip</h1>
      </div>
      <nav class="flex-grow">
        <ul class="p-2 space-y-2">
          <li>
            <Button
              :variant="activeMenu === 'home' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('home')"
            >
              <Home class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">홈</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'map' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('map')"
            >
              <Map class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">지도</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'region' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('region')"
            >
              <MapPinned class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">지역</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'stats' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('stats')"
            >
              <BarChart class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">통계</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'stats' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('users')"
            >
              <Users class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">사용자 목록</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'stats' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('notifications')"
            >
              <Bell class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">알림</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'stats' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('settings')"
            >
              <Settings class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">설정</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'stats' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('help')"
            >
              <HelpCircle class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">도움말</span>
            </Button>
          </li>
        </ul>
      </nav>
      <div :class="['p-4 border-t', isCollapsed ? 'flex justify-center' : '']">
        <Button
          variant="ghost"
          class="w-full justify-start p-0"
          @click="setActiveMenu('profile')"
        >
          <img
            src="@/assets/placeholder.svg?height=32&width=32"
            alt="User"
            class="w-8 h-8 rounded-full"
          />
          <span v-if="!isCollapsed" class="ml-2">{{
            userInfo?.userName || '사용자 이름'
          }}</span>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-md"
        @click="setIsCollapsed(!isCollapsed)"
      >
        <ChevronLeft
          :class="[
            'h-4 w-4 transition-transform duration-300',
            isCollapsed ? 'rotate-180' : '',
          ]"
        />
      </Button>
    </aside>

    <!-- Main Content -->
    <div class="flex-grow flex flex-col overflow-hidden">
      <!-- Header -->
      <header
        v-if="isMobile"
        class="bg-white shadow-sm p-4 flex items-center justify-between flex-shrink-0"
      >
        <h1 class="text-xl font-semibold">CatchTrip</h1>
        <div class="flex items-center space-x-2">
          <Button size="icon" variant="ghost" @click="setActiveMenu('users')">
            <Users class="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            @click="setActiveMenu('notifications')"
          >
            <Bell class="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            @click="setActiveMenu('settings')"
          >
            <Settings class="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" @click="setActiveMenu('help')">
            <HelpCircle class="h-5 w-5" />
          </Button>
        </div>
      </header>

      <!-- Scrollable Content -->
      <main
        :class="[
          'flex-grow p-6 overflow-auto bg-gray-100 space-y-6',
          isMobile ? 'pb-20' : '',
        ]"
      >
        <div class="flex justify-center items-center w-full">
          <component id="main-component" :is="renderContent" />
        </div>
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
@media (max-width: 900px) {
  #main-component {
    width: 500px; /* 모바일 화면에서는 90%로 설정 */
  }
}

@media (min-width: 900px) {
  #main-component {
    width: 800px; /* 769px 이상에서는 고정 width */
  }
}
</style>
