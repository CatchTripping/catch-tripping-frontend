<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

// Constants
const PASSWORD_PATTERN = {
  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
  description:
    '비밀번호는 최소 8자 이상, 대문자, 숫자 및 특수문자(!@#$%^&*)가 포함되어야 합니다.',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Reactive state
const formData = ref({
  username: '',
  useremail: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const validationState = ref({
  username: false,
  useremail: false,
})

const errors = ref({
  username: '',
  useremail: '',
  password: '',
  confirmPassword: '',
})

// Methods
const checkUsernameAvailability = async () => {
  if (!formData.value.username) {
    errors.value.username = '아이디를 입력해주세요.'
    return
  }

  try {
    const isAvailable = await userStore.checkUsername(formData.value.username)
    validationState.value.username = isAvailable
    console.log('Username validation state:', validationState.value)
    errors.value.username = isAvailable
      ? '사용 가능한 아이디입니다.'
      : '이미 사용 중인 아이디입니다.'
  } catch (error) {
    errors.value.username = '아이디 중복 확인 중 오류가 발생했습니다.'
    validationState.value.username = false
  }
}

const checkEmailAvailability = async () => {
  if (!formData.value.useremail) {
    errors.value.useremail = '이메일을 입력해주세요.'
    return
  }

  if (!EMAIL_PATTERN.test(formData.value.useremail)) {
    errors.value.useremail = '유효하지 않은 이메일 형식입니다.'
    validationState.value.useremail = false
    return
  }

  try {
    const isAvailable = await userStore.checkEmail(formData.value.useremail)
    validationState.value.useremail = isAvailable
    console.log('Email validation state:', validationState.value)
    errors.value.useremail = isAvailable
      ? '사용 가능한 이메일입니다.'
      : '이미 사용 중인 이메일입니다.'
  } catch (error) {
    errors.value.useremail = '이메일 중복 확인 중 오류가 발생했습니다.'
    validationState.value.useremail = false
  }
}

// Computed properties
const isPasswordValid = computed(() => {
  return (
    formData.value.password === '' ||
    (formData.value.password &&
      PASSWORD_PATTERN.pattern.test(formData.value.password))
  )
})

const isPasswordMatched = computed(() => {
  return (
    formData.value.confirmPassword === '' ||
    (formData.value.password &&
      formData.value.password === formData.value.confirmPassword)
  )
})

// isFormValid도 수정
const isFormValid = computed(() => {
  const passwordValidation =
    formData.value.password &&
    PASSWORD_PATTERN.pattern.test(formData.value.password)
  const passwordMatchValidation =
    formData.value.password === formData.value.confirmPassword

  const conditions = {
    username: !!formData.value.username,
    useremail: !!formData.value.useremail,
    password: !!formData.value.password && passwordValidation,
    confirmPassword:
      !!formData.value.confirmPassword && passwordMatchValidation,
    terms: formData.value.terms,
    usernameValidation: validationState.value.username,
    useremailValidation: validationState.value.useremail,
  }

  console.log('Form validation conditions:', conditions)

  return Object.values(conditions).every(condition => condition === true)
})

// 비밀번호 에러 메시지
const updatePasswordError = () => {
  if (
    formData.value.password &&
    !PASSWORD_PATTERN.pattern.test(formData.value.password)
  ) {
    errors.value.password = '비밀번호 형식이 올바르지 않습니다.'
  } else {
    errors.value.password = ''
  }
}

// 비밀번호 확인 에러 메시지
const updateConfirmPasswordError = () => {
  if (
    formData.value.confirmPassword &&
    formData.value.password !== formData.value.confirmPassword
  ) {
    errors.value.confirmPassword = '비밀번호가 일치하지 않습니다.'
  } else {
    errors.value.confirmPassword = ''
  }
}

// Form submission
const register = async () => {
  if (!isFormValid.value) return

  try {
    await userStore.registerUser({
      userName: formData.value.username,
      userPassword: formData.value.password,
      userEmail: formData.value.useremail,
    })
  } catch (error) {
    console.error('회원가입 실패:', error)
  }
}

// Style computed properties
const getInputClass = field => {
  if (field === 'password') {
    return formData.value.password && !isPasswordValid.value
      ? 'border-red-500'
      : ''
  }
  if (field === 'confirmPassword') {
    return formData.value.confirmPassword && !isPasswordMatched.value
      ? 'border-red-500'
      : ''
  }
  if (!validationState.value[field]) return ''
  return validationState.value[field] ? 'border-green-500' : 'border-red-500'
}

const getMessageClass = field => {
  if (!validationState.value[field]) return 'text-gray-500'
  return validationState.value[field] ? 'text-green-600' : 'text-red-600'
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-4">
      <div class="text-center">
        <h1 class="text-2xl font-bold mt-2 mb-4">회원가입</h1>
        <p class="text-gray-600 mb-4">계정을 만들려면 정보를 입력하세요.</p>
      </div>

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
              type="text"
            />
            <Button type="button" @click="checkUsernameAvailability"
              >중복 체크</Button
            >
          </div>
          <span :class="getMessageClass('username')" class="text-sm">{{
            errors.username
          }}</span>
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
            <Button type="button" @click="checkEmailAvailability"
              >중복 체크</Button
            >
          </div>
          <span :class="getMessageClass('useremail')" class="text-sm">{{
            errors.useremail
          }}</span>
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
            @input="updatePasswordError"
          />
          <span class="text-gray-500 text-sm">
            {{ PASSWORD_PATTERN.description }}
          </span>
          <span v-if="errors.password" class="text-red-600 text-sm">
            {{ errors.password }}
          </span>
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
            @input="updateConfirmPasswordError"
          />
          <span v-if="errors.confirmPassword" class="text-red-600 text-sm">
            {{ errors.confirmPassword }}
          </span>
        </div>

        <!-- Terms checkbox -->
        <div class="flex items-center space-x-2">
          <Checkbox
            id="terms"
            :checked="formData.terms"
            @update:checked="checked => (formData.terms = checked)"
          />
          <Label for="terms" class="text-sm text-gray-600">
            이용 약관 및 개인정보처리방침에 동의합니다.
          </Label>
        </div>

        <!-- Submit button -->
        <Button
          :disabled="!isFormValid"
          class="w-full bg-blue-500 hover:bg-blue-600"
          type="submit"
        >
          가입하기
        </Button>
      </form>
    </div>
  </div>
</template>
