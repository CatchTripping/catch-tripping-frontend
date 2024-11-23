<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, Smile } from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialog'

const dialogStore = useDialogStore()
const selectedPost = computed(() => dialogStore.selectedPost)

const currentImageIndex = ref(0)

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < selectedPost.value.imageUrls.length - 1) {
    currentImageIndex.value++
  }
}

// 댓글 관련 로직은 이후에 추가
</script>

<template>
  <div
    v-if="dialogStore.isDetailPostDialogOpen && selectedPost"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row"
    >
      <!-- 이미지 슬라이더 -->
      <div class="relative md:w-[600px] aspect-square">
        <img
          :src="selectedPost.imageUrls[currentImageIndex]"
          alt="Post image"
          class="object-cover w-full h-full"
        />
        <button
          v-if="currentImageIndex > 0"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80"
          @click="prevImage"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <button
          v-if="currentImageIndex < selectedPost.imageUrls.length - 1"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80"
          @click="nextImage"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>

      <!-- 게시물 정보 -->
      <div class="flex flex-col flex-1">
        <header class="p-4 border-b flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <img
              class="h-8 w-8 rounded-full"
              :src="selectedPost.profileImage || '/default-avatar.png'"
              alt="User Avatar"
            />
            <div>
              <h2 class="font-semibold text-sm">
                {{ selectedPost.userName }}
              </h2>
              <!-- 위치 정보는 필요에 따라 추가 -->
            </div>
          </div>
          <button class="ml-auto" @click="dialogStore.closeDetailPostDialog">
            닫기
          </button>
        </header>

        <!-- 게시물 내용 표시 -->
        <div class="p-4">
          <p>{{ selectedPost.content }}</p>
        </div>

        <!-- 댓글 표시 영역 -->
        <!-- 댓글 기능은 이후에 구현 -->

        <!-- 댓글 입력 -->
        <footer class="p-4 border-t flex items-center gap-2">
          <button>
            <Smile class="h-5 w-5" />
          </button>
          <input
            v-model="newComment"
            placeholder="댓글 달기..."
            class="flex-1 border-0 focus-visible:ring-0"
          />
          <button :disabled="!newComment" @click="handleComment">게시</button>
        </footer>
      </div>
    </div>
  </div>
</template>
