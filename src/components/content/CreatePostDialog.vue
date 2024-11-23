<script setup>
import { ref } from 'vue'
import {
  ImagePlus,
  ArrowLeft,
  ChevronLeft,
  X,
  ChevronRight,
  MapPin,
  Loader2,
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user.js'
import { useDialogStore } from '@/stores/dialog'
import api from '../../axios.js'

const dialogStore = useDialogStore()
const userStore = useUserStore()
const userInfo = userStore.userInfo

const step = ref(1)
const images = ref([]) // 실제 파일 객체 배열
const imagePreviews = ref([])
const currentImageIndex = ref(0)
const caption = ref('')
const location = ref('')
const fileInputRef = ref(null)
const isDragging = ref(false)
const isLoading = ref(false)

const openFileDialog = () => {
  fileInputRef.value.click()
}

const handleFileChange = e => {
  const files = Array.from(e.target.files)
  files.forEach(file => {
    images.value.push(file)
    imagePreviews.value.push(URL.createObjectURL(file))
  })
}

const handleDragEnter = e => {
  e.preventDefault()
  isDragging.value = true
}
const handleDragLeave = e => {
  e.preventDefault()
  isDragging.value = false
}
const handleDrop = e => {
  e.preventDefault()
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  files.forEach(file => {
    images.value.push(file)
    imagePreviews.value.push(URL.createObjectURL(file))
  })
}

const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const handleBack = () => {
  if (step.value === 2) step.value = 1
  else {
    images.value = []
    imagePreviews.value = []
    currentImageIndex.value = 0
  }
}

const handleNext = () => {
  if (step.value === 1 && images.value.length > 0) step.value = 2
}

const handlePost = async () => {
  if (isLoading.value) return // 이미 로딩 중이면 실행 방지

  try {
    isLoading.value = true // 로딩 시작

    // 이미지 업로드 로직
    const uploadPromises = images.value.map(async file => {
      const response = await api.get('/api/s3/presigned-url', {
        params: {
          filename: file.name,
          method: 'PUT',
          type: 'board',
        },
      })

      const { url, key } = response.data

      await api.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      })

      return key
    })

    const imageKeys = await Promise.all(uploadPromises)

    // 게시물 생성 요청
    const postData = {
      content: caption.value,
      imageKeys: imageKeys,
    }

    await api.post('/api/board', postData)

    // 성공 시 초기화 및 다이얼로그 닫기
    resetPostDialog()
    dialogStore.closeCreatePostDialog()
  } catch (error) {
    console.error('게시물 생성 중 오류 발생:', error)
    // 에러 처리 로직 추가 (예: 알림 표시)
  } finally {
    isLoading.value = false // 로딩 종료
  }
}

const resetPostDialog = () => {
  images.value = []
  imagePreviews.value = []
  caption.value = ''
  location.value = ''
  currentImageIndex.value = 0
  step.value = 1
}

const closeCreatePostDialog = () => {
  if (isLoading.value) {
    alert('업로드 중에는 창을 닫을 수 없습니다. 잠시만 기다려주세요.')
    return
  }
  resetPostDialog()
  dialogStore.closeCreatePostDialog()
}
</script>

<template>
  <div
    v-if="dialogStore.isCreatePostDialogOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
      <!-- 로딩 중일 때 중앙 로더 -->
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50"
      >
        <Loader2 size="100" color="#172341" class="animate-spin" />
      </div>

      <!-- Header -->
      <header class="p-4 border-b flex justify-between items-center">
        <button
          v-if="step === 1"
          @click="closeCreatePostDialog"
          class="mr-auto"
          :disabled="isLoading"
        >
          <X class="h-5 w-5 text-gray-500" />
        </button>
        <button
          v-if="step === 2"
          @click="handleBack"
          class="mr-auto"
          :disabled="isLoading"
        >
          <ArrowLeft class="h-5 w-5 text-gray-500" />
        </button>
        <h2 class="text-lg font-bold flex-1 text-center">
          {{ step === 1 ? '새 게시물 만들기' : '자르기' }}
        </h2>
        <button
          v-if="step === 1 && images.length > 0"
          @click="handleNext"
          class="text-blue-500"
          :disabled="isLoading"
        >
          다음
        </button>
        <button
          v-if="step === 2"
          @click="handlePost"
          class="text-blue-500 relative flex items-center justify-center"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">공유하기</span>
        </button>
      </header>

      <!-- Step 1: Image Upload and Viewer -->
      <div v-if="step === 1" class="p-4">
        <div
          v-if="imagePreviews.length === 0"
          class="border-dashed border-2 border-gray-300 p-6 text-center"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover.prevent
          @drop.prevent="handleDrop"
          :class="{ 'bg-gray-100': isDragging }"
        >
          <ImagePlus class="h-12 w-12 mx-auto" />
          <p>사진과 동영상을 여기에 끌어다 놓으세요</p>
          <button @click="openFileDialog" class="text-blue-500">
            컴퓨터에서 선택
          </button>
          <input
            id="fileInput"
            ref="fileInputRef"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFileChange"
          />
        </div>

        <div
          v-else
          class="relative w-full h-64 flex justify-center items-center"
        >
          <img
            :src="imagePreviews[currentImageIndex]"
            alt="Uploaded Image"
            class="object-contain h-full"
          />
          <button
            v-if="currentImageIndex > 0"
            @click="prevImage"
            class="absolute left-4 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button
            v-if="currentImageIndex < images.length - 1"
            @click="nextImage"
            class="absolute right-4 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Step 2: Caption and Location Input -->
      <div v-if="step === 2" class="flex">
        <!-- Left side: Image Preview -->
        <div class="w-2/3 relative">
          <img
            :src="imagePreviews[currentImageIndex]"
            alt="Uploaded Image"
            class="object-contain w-full h-full"
          />
          <button
            v-if="currentImageIndex > 0"
            @click="prevImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button
            v-if="currentImageIndex < images.length - 1"
            @click="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>

        <!-- Right side: Details form -->
        <div class="w-1/3 p-4 space-y-4 flex flex-col">
          <!-- User Info -->
          <div class="flex items-center space-x-2 border-b pb-2">
            <div
              class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"
              :style="
                userInfo?.profileImage
                  ? `background-image: url(${userInfo.profileImage}); background-size: cover; background-position: center;`
                  : ''
              "
            ></div>
            <!-- User Avatar Placeholder -->
            <span class="font-semibold">{{
              userInfo?.userName || '귀여운 토끼'
            }}</span>
          </div>

          <!-- Caption Input -->
          <textarea
            v-model="caption"
            placeholder="문구 입력..."
            class="w-full border rounded-lg p-2 resize-none"
            rows="4"
          ></textarea>
          <div class="text-right text-sm text-gray-400">
            {{ caption.length }}/2,200
          </div>

          <!-- Location Input -->
          <div class="flex items-center space-x-2 py-2 border-b">
            <MapPin class="h-5 w-5 text-gray-500" />
            <input
              v-model="location"
              placeholder="위치 추가"
              class="w-full border-0 focus:ring-0"
            />
          </div>

          <!-- Collapsible Settings (Accessibility and Advanced) -->
          <button
            class="w-full text-left py-2 border-b flex items-center justify-between"
          >
            접근성
            <ChevronRight class="h-4 w-4 text-gray-500" />
          </button>
          <button
            class="w-full text-left py-2 border-b flex items-center justify-between"
          >
            고급 설정
            <ChevronRight class="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed {
  position: fixed;
  inset: 0;
}
.z-50 {
  z-index: 50;
}
.bg-black {
  background-color: rgba(0, 0, 0, 0.5);
}

.loader {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  width: 16px;
  height: 16px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
