<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '../../axios.js'
import { useUserStore } from '@/stores/user' // 주신 userStore

const open = ref(false)
const photo = ref('/assets/no_picture.png')
const isLoading = ref(false)
const error = ref(null)
const userStore = useUserStore()

// 초기 프로필 이미지 설정
photo.value = userStore.userInfo?.profileImage || '/assets/no_picture.png'

// 사용자 정보 업데이트 함수
const updateUserInfo = async () => {
  const success = await userStore.getUserInfo()
  if (success) {
    photo.value = userStore.userInfo?.profileImage || '/assets/no_picture.png'
  } else {
    console.error('사용자 정보를 업데이트하는 데 실패했습니다.')
  }
}

const handlePhotoUpload = async event => {
  const file = event.target.files?.[0]
  if (file) {
    try {
      isLoading.value = true
      error.value = null

      // 1. presigned URL 얻기
      const response = await api.get('/api/s3/presigned-url', {
        params: {
          filename: file.name,
          method: 'PUT',
          type: 'profile', // 프로필 이미지용 타입
        },
      })

      const { url, key } = response.data

      // 2. S3에 이미지 업로드
      await api.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      })

      // 3. 서버에 프로필 이미지 업데이트 요청
      await api.post('/users/profile-image', {
        imageKey: key,
      })

      // 4. 사용자 정보 업데이트
      await updateUserInfo()

      // 5. 로컬 이미지 미리보기 업데이트
      const imageUrl = URL.createObjectURL(file)
      photo.value = imageUrl
      open.value = false
    } catch (err) {
      console.error('프로필 이미지 업로드 중 오류 발생:', err)
      error.value = '이미지 업로드에 실패했습니다.'
    } finally {
      isLoading.value = false
    }
  }
}

const handlePhotoDelete = async () => {
  try {
    isLoading.value = true
    error.value = null

    // 서버에 프로필 이미지 삭제 요청
    await api.delete('/users/profile-image')

    // 사용자 정보 업데이트
    await updateUserInfo()

    // 프로필 이미지 초기화
    photo.value = '/assets/no_picture.png'
    open.value = false
  } catch (err) {
    console.error('프로필 이미지 삭제 중 오류 발생:', err)
    error.value = '이미지 삭제에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto p-4 space-y-8">
      <h1 class="text-2xl font-semibold text-center mt-8">프로필 편집</h1>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="relative">
            <img
              :src="photo"
              alt="Profile photo"
              class="rounded-full object-cover w-16 h-16"
            />
          </div>
          <div class="flex flex-col">
            <span class="font-medium">{{ userStore.userInfo?.userName }}</span>
            <Button
              variant="link"
              class="text-blue-500 p-0 h-auto font-normal justify-start"
              @click="open = true"
            >
              사진 변경
            </Button>
          </div>
        </div>

        <Dialog v-model:open="open">
          <DialogContent class="max-w-xs p-0">
            <DialogHeader class="border-b">
              <DialogTitle class="text-center py-4">
                프로필 사진 바꾸기
              </DialogTitle>
            </DialogHeader>
            <div class="flex flex-col">
              <Label
                for="photo-upload"
                class="py-3 text-center text-blue-500 border-b cursor-pointer"
              >
                사진 업로드
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                />
              </Label>
              <Button
                variant="ghost"
                class="text-red-500 py-3 border-b rounded-none hover:bg-gray-50"
                @click="handlePhotoDelete"
              >
                현재 사진 삭제
              </Button>
              <Button
                variant="ghost"
                class="py-3 rounded-none hover:bg-gray-50"
                @click="open = false"
              >
                취소
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tailwind CSS 스타일 적용 */
</style>
