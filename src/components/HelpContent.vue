<script setup>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">도움말</h2>
    <div class="flex items-center space-x-2 mb-4">
      <Input type="search" placeholder="도움말 검색..." className="max-w-sm" />
      <Button size="icon" variant="ghost">
        <Search class="h-5 w-5" />
      </Button>
    </div>
    <p>MapDash 사용에 대한 도움이 필요하신가요? 아래 연락처로 문의해주세요:</p>
    <ul class="list-disc list-inside">
      <li>이메일: support@mapdash.com</li>
      <li>전화: 02-1234-5678</li>
      <li>채팅: 우측 하단의 채팅 아이콘을 클릭하세요</li>
    </ul>
  </div>
</template>

<style scoped>
/* 필요한 스타일을 여기에 추가하세요 */
</style>
