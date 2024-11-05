<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

// Reactive state
const email = ref('')
const fullName = ref('')
const username = ref('')
const password = ref('')
const terms = ref(false)

// Handle form submission
const handleSubmit = () => {
  console.log('Email:', email.value)
  console.log('Full Name:', fullName.value)
  console.log('Username:', username.value)
  console.log('Password:', password.value)
  console.log('Terms accepted:', terms.value)
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-4">
      <div class="text-center">
        <!--        <InstagramIcon class="w-16 h-16 mx-auto text-pink-500" />-->
        <h1 class="text-2xl font-bold mt-2 mb-4">Instagram</h1>
        <p class="text-gray-600 mb-4">
          친구들의 사진과 동영상을 보려면 가입하세요.
        </p>
      </div>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <Label for="email" class="sr-only">이메일 주소</Label>
          <Input
            id="email"
            v-model="email"
            placeholder="이메일 주소"
            required
            type="email"
          />
        </div>
        <div class="space-y-2">
          <Label for="fullName" class="sr-only">성명</Label>
          <Input
            id="fullName"
            v-model="fullName"
            placeholder="성명"
            required
            type="text"
          />
        </div>
        <div class="space-y-2">
          <Label for="username" class="sr-only">사용자 이름</Label>
          <Input
            id="username"
            v-model="username"
            placeholder="사용자 이름"
            required
            type="text"
          />
        </div>
        <div class="space-y-2">
          <Label for="password" class="sr-only">비밀번호</Label>
          <Input
            id="password"
            v-model="password"
            placeholder="비밀번호"
            required
            type="password"
          />
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="terms" v-model="terms" />
          <Label for="terms" class="text-sm text-gray-600">
            이용 약관 및 개인정보처리방침에 동의합니다.
          </Label>
        </div>
        <Button class="w-full bg-blue-500 hover:bg-blue-600" type="submit">
          가입하기
        </Button>
      </form>
    </div>
    <div
      class="mt-4 w-full max-w-md bg-white rounded-lg shadow-md p-4 text-center"
    >
      <p class="text-sm">
        계정이 있으신가요?{" "}
        <a href="#" class="text-blue-500 font-semibold hover:underline">
          로그인
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 필요한 추가 스타일이 있으면 여기 작성 */
</style>
