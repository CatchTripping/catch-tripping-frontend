<script setup>
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/index.js'
</script>

<template>
  <Card class="m-6 max-w-[600px]">
    <CardHeader>
      <CardTitle>설정</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <!-- 계정 설정 -->
        <div>
          <h3 class="text-lg font-medium">계정 설정</h3>
          <Button variant="outline" class="w-full mt-2">비밀번호 변경</Button>
          <Button variant="outline" class="w-full mt-2">이메일 변경</Button>
        </div>

        <!-- 알림 설정 -->
        <div>
          <h3 class="text-lg font-medium">알림 설정</h3>
          <Button variant="outline" class="w-full mt-2"
            >이메일 알림 설정
          </Button>
          <Button variant="outline" class="w-full mt-2">푸시 알림 설정</Button>
        </div>

        <!-- 앱 설정 -->
        <div>
          <h3 class="text-lg font-medium">앱 설정</h3>
          <Button variant="outline" class="w-full mt-2">언어 설정</Button>
          <Button variant="outline" class="w-full mt-2">테마 설정</Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
