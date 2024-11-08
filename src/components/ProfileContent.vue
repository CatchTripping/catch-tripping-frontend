<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>프로필</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex items-center space-x-4 mb-4">
        <img
          src="@/assets/placeholder.svg?height=100&width=100"
          alt="User"
          class="w-24 h-24 rounded-full"
        />
        <div>
          <h2 class="text-2xl font-bold">사용자 이름</h2>
          <p class="text-gray-500">user@example.com</p>
        </div>
      </div>
      <div class="space-y-4">
        <Button class="w-full">프로필 편집</Button>
        <Button variant="outline" class="w-full">설정</Button>
        <Button variant="destructive" class="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
