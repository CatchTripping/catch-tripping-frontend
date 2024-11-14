<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

// Validation patterns
const PASSWORD_PATTERN = {
  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
  description: '비밀번호는 최소 8자 이상, 대문자, 숫자 및 특수문자(!@#$%^&*)가 포함되어야 합니다.',
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reactive states
const formData = ref({
  username: '',
  useremail: '',
  password: '',
  confirmPassword: '',
  terms: false,
});
const validationState = ref({
  username: null,
  useremail: null,
  password: null,
  confirmPassword: null,
});
const errors = ref({
  username: '',
  useremail: '',
  password: '',
  confirmPassword: '',
});

// Methods
const checkUsernameAvailability = async () => {
  if (!formData.value.username) {
    errors.value.username = '아이디를 입력해주세요.';
    validationState.value.username = null;
    return;
  }
  try {
    const isAvailable = await userStore.checkUsername(formData.value.username);
    validationState.value.username = isAvailable;
    errors.value.username = isAvailable ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.';
  } catch (error) {
    validationState.value.username = false;
    errors.value.username = error.response?.data?.description || '아이디 중복 확인 중 오류가 발생했습니다.';
  }
};

const checkEmailAvailability = async () => {
  if (!formData.value.useremail) {
    errors.value.useremail = '이메일을 입력해주세요.';
    validationState.value.useremail = null;
    return;
  }
  if (!EMAIL_PATTERN.test(formData.value.useremail)) {
    errors.value.useremail = '유효하지 않은 이메일 형식입니다.';
    validationState.value.useremail = false;
    return;
  }
  try {
    const isAvailable = await userStore.checkEmail(formData.value.useremail);
    validationState.value.useremail = isAvailable;
    errors.value.useremail = isAvailable ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.';
  } catch (error) {
    validationState.value.useremail = false;
    errors.value.useremail = error.response?.data?.description || '이메일 중복 확인 중 오류가 발생했습니다.';
  }
};

// Computed properties
const isPasswordValid = computed(() => formData.value.password && PASSWORD_PATTERN.pattern.test(formData.value.password));
const isPasswordMatched = computed(() => formData.value.password && formData.value.password === formData.value.confirmPassword);

watchEffect(() => {
  if (formData.value.password) {
    validationState.value.password = isPasswordValid.value;
    errors.value.password = isPasswordValid.value ? '' : '비밀번호 형식이 올바르지 않습니다.';
  } else {
    validationState.value.password = null; // 빈칸일 때 기본 상태로 설정
    errors.value.password = '';
  }

  if (formData.value.confirmPassword) {
    validationState.value.confirmPassword = isPasswordMatched.value;
    errors.value.confirmPassword = isPasswordMatched.value ? '' : '비밀번호가 일치하지 않습니다.';
  } else {
    validationState.value.confirmPassword = null; // 빈칸일 때 기본 상태로 설정
    errors.value.confirmPassword = '';
  }
});


const isFormValid = computed(() => {
  return (
    validationState.value.username === true &&
    validationState.value.useremail === true &&
    isPasswordValid.value &&
    isPasswordMatched.value &&
    formData.value.terms
  );
});

// Watch for changes in error messages
watch(errors, (newErrors) => {
  if (newErrors.username === '이미 사용 중인 아이디입니다.') validationState.value.username = false;
  if (newErrors.useremail === '이미 사용 중인 이메일입니다.') validationState.value.useremail = false;
});

// Form submission
const register = async () => {
  if (!isFormValid.value) {
    alert('모든 필드를 올바르게 입력해주세요.');
    return;
  }
  try {
    await userStore.registerUser({
      userName: formData.value.username,
      userPassword: formData.value.password,
      userEmail: formData.value.useremail,
    });
  } catch (error) {
    alert(error.response?.data?.description || '회원가입 중 문제가 발생했습니다.');
    if (error.response?.data?.description.includes('아이디')) validationState.value.username = false;
    if (error.response?.data?.description.includes('이메일')) validationState.value.useremail = false;
  }
};

// Style computed properties
const getInputClass = (field) => {
  if (field === 'password') {
    return validationState.value.password === false ? 'border-red-500' : validationState.value.password === true ? 'border-green-500' : '';
  }
  if (field === 'confirmPassword') {
    return validationState.value.confirmPassword === false ? 'border-red-500' : validationState.value.confirmPassword === true ? 'border-green-500' : '';
  }
  if (field === 'username' || field === 'useremail') {
    if (validationState.value[field] === null) return ''; // 기본 스타일 유지
    return validationState.value[field] ? 'border-green-500' : 'border-red-500';
  }
  return '';
};

const getMessageClass = (field) => {
  if (validationState.value[field] === null) return 'text-gray-500';
  return validationState.value[field] ? 'text-green-600' : 'text-red-600';
};

</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-4">
      <h1 class="text-2xl font-bold text-center">회원가입</h1>
      <form class="space-y-4" @submit.prevent="register">

        <!-- Username field -->
        <div class="space-y-2">
          <Label for="username">아이디</Label>
          <div class="flex items-center space-x-2">
            <Input
              :class="getInputClass('username')"
              id="username"
              v-model="formData.username"
              placeholder="아이디 입력"
              required
            />
            <Button type="button" @click="checkUsernameAvailability">중복 체크</Button>
          </div>
          <span :class="getMessageClass('username')" class="text-sm">{{ errors.username }}</span>
        </div>

        <!-- Email field -->
        <div class="space-y-2">
          <Label for="useremail">이메일</Label>
          <div class="flex items-center space-x-2">
            <Input
              :class="getInputClass('useremail')"
              id="useremail"
              v-model="formData.useremail"
              placeholder="이메일 입력"
              required
              type="email"
            />
            <Button type="button" @click="checkEmailAvailability">중복 체크</Button>
          </div>
          <span :class="getMessageClass('useremail')" class="text-sm">{{ errors.useremail }}</span>
        </div>

        <!-- Password field -->
        <div class="space-y-2">
          <Label for="password">비밀번호</Label>
          <Input
            :class="getInputClass('password')"
            id="password"
            v-model="formData.password"
            placeholder="비밀번호 입력"
            required
            type="password"
          />
          <span class="text-gray-500 text-sm">{{ PASSWORD_PATTERN.description }}</span>
          <span v-if="errors.password" class="text-red-600 text-sm">{{ errors.password }}</span>
        </div>

        <!-- Confirm password field -->
        <div class="space-y-2">
          <Label for="confirmPassword">비밀번호 확인</Label>
          <Input
            :class="getInputClass('confirmPassword')"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            placeholder="비밀번호 확인"
            required
            type="password"
          />
          <span v-if="errors.confirmPassword" class="text-red-600 text-sm">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Terms checkbox -->
        <div class="flex items-center space-x-2">
          <Checkbox
            id="terms"
            v-model:checked="formData.terms"
          />
          <Label for="terms" class="text-sm text-gray-600">이용 약관 및 개인정보처리방침에 동의합니다.</Label>
        </div>

        <!-- Submit button -->
        <Button :disabled="!isFormValid" class="w-full bg-blue-500 hover:bg-blue-600" type="submit">
          가입하기
        </Button>
      </form>
    </div>
  </div>
</template>
