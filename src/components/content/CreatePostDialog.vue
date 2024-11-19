<script setup>
import { ref } from 'vue'
import {
  ImagePlus,
  ArrowLeft,
  ChevronLeft,
  X,
  ChevronRight,
  MapPin,
} from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialog'

const dialogStore = useDialogStore()

const step = ref(1)
const images = ref([])
const currentImageIndex = ref(0)
const caption = ref('')
const location = ref('')
const fileInputRef = ref(null)
const isDragging = ref(false)

const openFileDialog = () => {
  fileInputRef.value.click()
}

const handleFileChange = e => {
  const files = Array.from(e.target.files)
  const newImages = files.map(file => URL.createObjectURL(file))
  images.value.push(...newImages)
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
  const newImages = files.map(file => URL.createObjectURL(file))
  images.value.push(...newImages)
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
    currentImageIndex.value = 0
  }
}

const handleNext = () => {
  if (step.value === 1 && images.value.length > 0) step.value = 2
}

const handlePost = () => {
  console.log({
    images: images.value,
    location: location.value,
    caption: caption.value,
  })
  dialogStore.closeCreatePostDialog()
}
</script>

<template>
  <div
    v-if="dialogStore.isCreatePostDialogOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl">
      <!-- Header -->
      <header class="p-4 border-b flex justify-between items-center">
        <button
          v-if="step === 1"
          @click="dialogStore.closeCreatePostDialog()"
          class="mr-auto"
        >
          <X class="h-5 w-5 text-gray-500" />
        </button>
        <button v-if="step === 2" @click="handleBack" class="mr-auto">
          <ArrowLeft class="h-5 w-5 text-gray-500" />
        </button>
        <h2 class="text-lg font-bold flex-1 text-center">
          {{ step === 1 ? '새 게시물 만들기' : '자르기' }}
        </h2>
        <button
          v-if="step === 1 && images.length > 0"
          @click="handleNext"
          class="text-blue-500"
        >
          다음
        </button>
        <button v-if="step === 2" @click="handlePost" class="text-blue-500">
          공유하기
        </button>
      </header>

      <!-- Step 1: Image Upload and Viewer -->
      <div v-if="step === 1" class="p-4">
        <div
          v-if="images.length === 0"
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
            :src="images[currentImageIndex]"
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
            :src="images[currentImageIndex]"
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
            <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
            <!-- User Avatar Placeholder -->
            <span class="font-semibold">username</span>
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
</style>
