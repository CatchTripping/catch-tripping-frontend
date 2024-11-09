<script setup>
import { ref } from 'vue'
import { BarChart, Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input/index.js'
import { Button } from '@/components/ui/button/index.js'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.js'

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
        <Input
          v-model="searchQuery"
          type="search"
          placeholder="통계 항목 검색..."
          class="max-w-sm"
        />
        <Button size="icon" variant="ghost" @click="handleSearch">
          <Search class="h-5 w-5" />
        </Button>
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
