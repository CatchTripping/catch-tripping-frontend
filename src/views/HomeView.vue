<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  BarChart,
  ChevronDown,
  ChevronLeft,
  HelpCircle,
  Home,
  Map,
  Users,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Logo from '@/components/icon/MainLogo.vue'
import HomeContent from '@/components/HomeContent.vue'
import MapContent from '@/components/MapContent.vue'
import StatsContent from '@/components/StatsContent.vue'
import UsersContent from '@/components/UsersContent.vue'
import HelpContent from '@/components/HelpContent.vue'
import { useUserStore } from '@/stores/user';
import router from '@/router/index.js'

// 상태 변수
const isCollapsed = ref(false)
const activeMenu = ref('home')

// 드롭다운 상태 관리
const isDropdownOpen = ref(false)

// 유저
const userStore = useUserStore()

// 로그아웃 함수
const logout = async () => {
  await userStore.logout()
  router.push('/login')
}

// 윈도우 크기 변경에 따라 사이드바 크기 조정
const handleResize = () => {
  isCollapsed.value = window.innerWidth < 1024
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
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white min-h-screen flex flex-col transition-all duration-300 relative',
        isCollapsed ? 'w-16' : 'w-64',
      ]"
    >
      <div
        :class="[
          'p-4 border-b flex items-center',
          isCollapsed ? 'justify-center' : 'justify-start',
        ]"
      >
        <Logo v-if="isCollapsed" />
        <h1 v-else class="text-2xl font-bold">MapDash</h1>
      </div>

      <nav class="flex-grow">
        <ul class="p-2 space-y-2">
          <li>
            <Button
              :variant="activeMenu === 'home' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="activeMenu = 'home'"
            >
              <Home class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">홈</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'map' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="activeMenu = 'map'"
            >
              <Map class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">지도</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'stats' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="activeMenu = 'stats'"
            >
              <BarChart class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">통계</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'users' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="activeMenu = 'users'"
            >
              <Users class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">사용자</span>
            </Button>
          </li>
          <li>
            <Button
              :variant="activeMenu === 'help' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="activeMenu = 'help'"
            >
              <HelpCircle class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">도움말</span>
            </Button>
          </li>
        </ul>
      </nav>

      <!-- User Profile Dropdown -->
      <div class="p-4 border-t">
        <DropdownMenu v-model:open="isDropdownOpen">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" class="w-full justify-start">
              <span v-if="!isCollapsed" class="ml-2">사용자 이름</span>
              <ChevronDown
                class="ml-auto h-4 w-4 transition-transform duration-300"
                :class="{ 'rotate-180': isDropdownOpen }"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-56">
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>프로필</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
            <DropdownMenuItem @click="logout">로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Toggle Sidebar Button -->
      <Button
        variant="ghost"
        size="icon"
        class="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-md"
        @click="isCollapsed = !isCollapsed"
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
      <!-- Scrollable Content -->
      <main class="flex-grow p-6 overflow-auto bg-gray-100 space-y-6">
        <!-- 동적 컴포넌트 렌더링 -->
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
    </div>
  </div>
</template>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다 */
</style>
