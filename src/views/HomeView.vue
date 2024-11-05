<script setup>
import { ref, onMounted } from 'vue'

// 아이콘 컴포넌트 임포트
import {
  ChevronDown,
  ChevronLeft,
  Bell,
  Search,
  Settings,
  Map,
  Home,
  BarChart,
  Users,
  HelpCircle,
} from 'lucide-vue-next'

// 버튼, 입력, 드롭다운 메뉴, 카드 컴포넌트 임포트
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// Handle screen resizing
const handleResize = () => {
  isCollapsed.value = window.innerWidth < 1024
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // Initial check
})
</script>
<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white min-h-screen flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
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
        <h1 v-else class="text-2xl font-bold">MapDash</h1>
      </div>

      <nav class="flex-grow">
        <ul class="p-2 space-y-2">
          <li>
            <Button variant="ghost" class="w-full justify-start">
              <Home class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">홈</span>
            </Button>
          </li>
          <li>
            <Button variant="ghost" class="w-full justify-start">
              <Map class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">지도</span>
            </Button>
          </li>
          <li>
            <Button variant="ghost" class="w-full justify-start">
              <BarChart class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">통계</span>
            </Button>
          </li>
          <li>
            <Button variant="ghost" class="w-full justify-start">
              <Users class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">사용자</span>
            </Button>
          </li>
          <li>
            <Button variant="ghost" class="w-full justify-start">
              <HelpCircle class="h-4 w-4" />
              <span v-if="!isCollapsed" class="ml-2">도움말</span>
            </Button>
          </li>
        </ul>
      </nav>

      <!-- Account Menu -->
      <div class="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" class="w-full justify-start">
              <!--              <img src="/placeholder.svg?height=32&width=32" alt="User" class="w-8 h-8 rounded-full" />-->
              <span v-if="!isCollapsed" class="ml-2">사용자 이름</span>
              <ChevronDown v-if="!isCollapsed" class="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56">
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>프로필</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
            <DropdownMenuItem>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Toggle Collapse Button -->
      <Button
        variant="ghost"
        size="icon"
        class="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-md"
        @click="toggleCollapse"
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
      <header class="bg-white shadow-sm p-4 flex items-center flex-shrink-0">
        <div class="flex-grow flex items-center">
          <Input type="search" placeholder="검색..." class="max-w-sm mr-2" />
          <Button size="icon" variant="ghost">
            <Search class="h-5 w-5" />
          </Button>
        </div>
        <Button size="icon" variant="ghost" class="mr-2">
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
      </header>

      <!-- Scrollable Content -->
      <main class="flex-grow p-6 overflow-auto bg-gray-100">
        <div class="space-y-6">
          <!-- Map Card -->
          <Card>
            <CardHeader>
              <CardTitle>지도</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                class="aspect-video bg-gray-200 rounded-md flex items-center justify-center"
              >
                <Map class="h-16 w-16 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <!-- Statistics Card -->
          <Card>
            <CardHeader>
              <CardTitle>통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                class="h-64 bg-gray-200 rounded-md flex items-center justify-center"
              >
                <BarChart class="h-16 w-16 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <!-- User List Card -->
          <Card>
            <CardHeader>
              <CardTitle>사용자 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2">
                <li
                  v-for="i in 5"
                  :key="i"
                  class="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                >
                  <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p class="font-medium">사용자 {{ i }}</p>
                    <p class="text-sm text-gray-500">user{{ i }}@example.com</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Additional Content for Scrolling -->
          <Card>
            <CardHeader>
              <CardTitle>추가 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <p>이 영역은 스크롤 기능을 시연하기 위한 추가 콘텐츠입니다.</p>
              <p class="mt-4">스크롤을 통해 더 많은 내용을 볼 수 있습니다.</p>
              <div
                class="mt-4 h-40 bg-gray-200 rounded-md flex items-center justify-center"
              >
                <p class="text-gray-400">추가 콘텐츠 영역</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 추가적인 스타일이 필요하다면 여기에 작성 */
</style>
