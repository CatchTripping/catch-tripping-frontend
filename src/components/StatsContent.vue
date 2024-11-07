<script setup>
import { ref } from 'vue'
import { BarChart, Search } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const searchQuery = ref('')

const handleSearch = () => {
  console.log('검색:', searchQuery.value)
}
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>통계</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex items-center space-x-2 mb-4">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="통계 항목 검색..."
          class="max-w-sm"
        />
        <button @click="handleSearch" class="p-2 bg-transparent border-0">
          <Search class="h-5 w-5" />
        </button>
      </div>
      <div class="h-64 bg-gray-200 rounded-md flex items-center justify-center">
        <BarChart class="h-16 w-16 text-gray-400" />
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다 */
</style>
