<script setup>
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const searchQuery = ref('')

// 사용자 목록을 나타내기 위한 더미 데이터 생성
const users = Array.from({ length: 5 }, (_, i) => ({
  name: `사용자 ${i + 1}`,
  email: `user${i + 1}@example.com`,
}))

const handleSearch = () => {
  console.log('검색:', searchQuery.value)
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>사용자 목록</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- 검색 입력 -->
      <div class="flex items-center space-x-2 mb-4">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="사용자 검색..."
          class="max-w-sm"
        />
        <button @click="handleSearch" class="p-2 bg-transparent border-0">
          <Search class="h-5 w-5" />
        </button>
      </div>

      <!-- 사용자 목록 출력 -->
      <ul class="space-y-2">
        <li
          v-for="(user, i) in users"
          :key="i"
          class="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
        >
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <p class="font-medium">{{ user.name }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다 */
</style>
