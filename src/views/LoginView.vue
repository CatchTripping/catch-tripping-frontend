<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import router from '@/router/index.js'

// Reactive state
const username = ref('')
const password = ref('')
const rememberMe = ref(false)

const userStore = useUserStore()

const login = async () => {
  try {
    const loginSuccess = await userStore.login(
      username.value,
      password.value,
      rememberMe.value,
    )
    console.log('Login success:', loginSuccess) // 디버깅용 로그
    console.log('IsLoggedIn after login:', userStore.isLoggedIn) // 디버깅용 로그

    // if (userStore.isLoggedIn) {
    if (loginSuccess) {
      await router.push('/home')
    } else {
      throw new Error('Login state not set properly')
    }
  } catch (error) {
    console.error('Login Failed:', error)
    alert('로그인 실패. 아이디와 비밀번호를 확인하세요.')
  }
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
      </div>
      <form class="space-y-4" @submit.prevent="login">
        <div class="space-y-2">
          <Label for="username" class="sr-only">사용자 이름 또는 이메일</Label>
          <Input
            id="username"
            v-model="username"
            placeholder="사용자 이름 또는 이메일"
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
        <div class="flex items-center">
          <input type="checkbox" id="rememberMe" v-model="rememberMe" />
          <label for="rememberMe" class="ml-2">로그인 상태 유지</label>
        </div>
        <Button class="w-full bg-blue-500 hover:bg-blue-600" type="submit">
          로그인
        </Button>
      </form>
      <div class="text-center">
        <a href="#" class="text-sm text-blue-500 hover:underline"
          >비밀번호를 잊으셨나요?</a
        >
      </div>
    </div>
    <div
      class="mt-4 w-full max-w-md bg-white rounded-lg shadow-md p-4 text-center"
    >
      <p class="text-sm">
        계정이 없으신가요?
        <router-link
          to="/signup"
          class="text-blue-500 font-semibold hover:underline"
        >
          >가입하기</router-link
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 추가적인 스타일이 필요하면 여기 작성 */
</style>
