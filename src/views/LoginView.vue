<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '../axios.js';
import router from "@/router/index.js";


// Reactive state
const username = ref('')
const password = ref('')

const login = async () => {
  try {
    const params = new URLSearchParams();
    params.append('username', username.value);
    params.append('password', password.value);

    const response = await api.post('/authenticate', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.status === "success") {
      router.push('/home');
    }
  } catch (error) {
    console.error('Login Failed: ', error);
    alert('로그인 실패. 아이디와 비밀번호를 확인하세요.');
  }
};
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
        <router-link to="/signup" class="text-blue-500 font-semibold hover:underline">
          >가입하기</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 추가적인 스타일이 필요하면 여기 작성 */
</style>
