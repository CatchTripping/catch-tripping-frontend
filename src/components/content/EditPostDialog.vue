<script setup>
import { ref, computed, watch } from 'vue'
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialog'
import { useUserStore } from '@/stores/user.js'
import { usePostsStore } from '@/stores/posts.js'
import defaultAvatar from '@/assets/no_picture.png'
import api from '../../axios.js'

const dialogStore = useDialogStore()
const userStore = useUserStore()
const postsStore = usePostsStore()
const userInfo = userStore.userInfo

const selectedPost = computed(() => dialogStore.selectedPost)
const currentImageIndex = ref(0)
const caption = ref('')
const isLoading = ref(false)

watch(
  () => dialogStore.selectedPost,
  newPost => {
    if (newPost) {
      caption.value = newPost.caption || '' // 초기값 설정
    }
  },
  { immediate: true },
)

const handleUpdate = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    const postData = {
      content: caption.value,
    }
    const response = await api.patch(
      `/api/board/${selectedPost.value.id}`,
      postData,
    )
    const updatedPostData = response.data
    postsStore.updatePost(updatedPostData)
    dialogStore.closeEditPostDialog()
  } catch (error) {
    console.error('게시물 수정 중 오류 발생:', error)
  } finally {
    isLoading.value = false
  }
}

const closeEditPostDialog = () => {
  if (isLoading.value) {
    alert('업데이트 중에는 창을 닫을 수 없습니다. 잠시만 기다려주세요.')
    return
  }
  dialogStore.closeEditPostDialog()
}
</script>

<template>
  <div
    v-if="dialogStore.isEditPostDialogOpen && selectedPost"
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
          @click="closeEditPostDialog"
          class="mr-auto"
          :disabled="isLoading"
        >
          <X class="h-5 w-5 text-gray-500" />
        </button>
        <h2 class="text-lg font-bold flex-1 text-center">게시물 수정하기</h2>
        <button
          @click="handleUpdate"
          class="text-blue-500 relative flex items-center justify-center"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">완료</span>
        </button>
      </header>

      <!-- Content -->
      <div class="flex">
        <!-- Left side: Image Preview -->
        <div
          class="w-2/3 relative"
          v-if="selectedPost.images && selectedPost.images.length > 0"
        >
          <img
            :src="selectedPost.images[currentImageIndex]"
            alt="Uploaded Image"
            class="object-contain w-full h-full"
          />
          <button
            v-if="currentImageIndex > 0"
            @click="currentImageIndex--"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button
            v-if="currentImageIndex < selectedPost.images.length - 1"
            @click="currentImageIndex++"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>

        <!-- Right side: Details form -->
        <div class="w-1/3 p-4 space-y-4 flex flex-col">
          <!-- User Info -->
          <div class="flex items-center space-x-2 border-b pb-2">
            <img
              class="w-8 h-8 rounded-full"
              :src="userInfo?.profileImage || defaultAvatar"
              alt="User Avatar"
            />
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
