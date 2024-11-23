<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  HelpCircle,
  Home,
  Map,
  MapPinned,
  Footprints,
  BotMessageSquare,
  ImagePlus,
  Settings,
} from 'lucide-vue-next'

import { defineAsyncComponent } from 'vue'

const HomeContent = defineAsyncComponent(() => import('@/components/content/HomeContent.vue'))
const MapContent = defineAsyncComponent(() => import('@/components/content/MapContent.vue'))
const HelpContent = defineAsyncComponent(() => import('@/components/content/HelpContent.vue'))
const BottomNavigation = defineAsyncComponent(() => import('@/components/content/BottomNavigation.vue'))
const ProfileContent = defineAsyncComponent(() => import('@/components/content/ProfileContent.vue'))
const SettingsContent = defineAsyncComponent(() => import('@/components/content/SettingsContent.vue'))
const RegionContent = defineAsyncComponent(() => import('@/components/content/RegionContent.vue'))
const CreatePostDialog = defineAsyncComponent(() => import('@/components/content/CreatePostDialog.vue'))
const CourseContent = defineAsyncComponent(() => import('@/components/content/CourseContent.vue'))
const AITravelContent = defineAsyncComponent(() => import('@/components/content/AITravelContent.vue'))
import { useUserStore } from '@/stores/user'
import { useDialogStore } from '@/stores/dialog'

// 유저 정보 및 로그아웃 함수 정의
const userStore = useUserStore()
const userInfo = userStore.userInfo // userInfo 상태 가져오기

const dialogStore = useDialogStore()

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
    case 'profile':
      return ProfileContent
    case 'course':
      return CourseContent
    case 'ai':
      return AITravelContent
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
        isCollapsed ? 'w-16 min-w-16' : 'w-48 min-w-48',
        'relative',
      ]"
    >
      <div :class="['p-4 border-b flex items-center', 'justify-start']">
        <h1 v-if="isCollapsed" class="text-2xl font-bold">CT</h1>
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
              :variant="activeMenu === 'course' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('course')"
            >
              <Footprints class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">코스</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'ai' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('ai')"
            >
              <BotMessageSquare class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">AI 여행</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'make' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="
                () => {
                  setActiveMenu('make')
                  dialogStore.openCreatePostDialog()
                }
              "
            >
              <ImagePlus class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">만들기</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'settings' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('settings')"
            >
              <Settings class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">설정</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'help' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setActiveMenu('help')"
            >
              <HelpCircle class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">도움말</span>
            </Button>
          </li>
        </ul>
      </nav>
      <div class="p-3 border-t flex justify-center">
        <Button
          variant="ghost"
          class="w-full justify-start p-0"
          @click="setActiveMenu('profile')"
        >
          <img
            src="@/assets/no_picture.png"
            alt="User"
            class="w-10 h-10 rounded-full"
          />
          <span v-if="!isCollapsed" class="ml-2">{{
            userInfo?.userName || '귀여운 토끼'
          }}</span>
        </Button>
      </div>
      <!-- 여닫이-->
      <Button
        variant="ghost"
        size="icon"
        class="absolute -right-3 top-1/2 bg-white border border-gray-200 rounded-full shadow-md z-50"
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

      <!-- Content -->
      <main class="flex-grow overflow-auto bg-gray-100">
        <div class="flex justify-center items-center w-full">
          <component class="w-full" :is="renderContent" :is-mobile="isMobile" />
        </div>
      </main>

      <!-- 다이얼로그 컴포넌트 -->
      <CreatePostDialog />

      <!-- Bottom Navigation for mobile -->
      <BottomNavigation
        v-if="isMobile"
        :activeMenu="activeMenu"
        :setActiveMenu="setActiveMenu"
      />
    </div>
  </div>
</template>

<style scoped></style>
