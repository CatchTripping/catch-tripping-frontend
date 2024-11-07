<script setup>
import { ref } from 'vue'
import { usePostsStore } from '@/stores/posts.js'
import {
  Search,
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from 'lucide-vue-next'

// Pinia 스토어 가져오기
const postsStore = usePostsStore()

// 상태 관리
const currentSlides = ref(postsStore.getPosts.map(() => 0))
const searchQuery = ref('')

// 슬라이드 변경 함수
const handleSlideChange = (postIndex, direction) => {
  currentSlides.value = currentSlides.value.map((slide, index) => {
    if (index === postIndex) {
      if (direction === 'prev') {
        return Math.max(0, slide - 1)
      } else {
        return Math.min(
          postsStore.getPosts[postIndex].images.length - 1,
          slide + 1,
        )
      }
    }
    return slide
  })
}

// 더보기 버튼 클릭
const onMoreClick = () => {
  // 버튼 클릭 시 처리할 로직 (예: 메뉴 열기)
}

// 검색 버튼 클릭
const onSearchClick = () => {
  // 검색 버튼 클릭 시 처리할 로직
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">홈</h2>

    <!-- 검색바 -->
    <div class="flex items-center space-x-2 mb-4">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="검색..."
        class="max-w-sm"
      />
      <button class="icon-button" @click="onSearchClick">
        <Search class="h-5 w-5" />
      </button>
    </div>

    <!-- Stories -->
    <div class="overflow-x-auto no-scrollbar">
      <div class="flex gap-4 p-4 min-w-max">
        <div
          v-for="story in postsStore.getStories"
          :key="story.id"
          class="flex flex-col items-center gap-1"
        >
          <div
            class="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600"
          >
            <img
              :src="story.avatar"
              :alt="story.username"
              class="rounded-full border-2 border-background"
            />
          </div>
          <span class="text-xs text-muted-foreground">{{
            story.username
          }}</span>
        </div>
      </div>
    </div>

    <!-- Posts -->
    <div class="space-y-6">
      <div
        v-for="(post, postIndex) in postsStore.getPosts"
        :key="post.id"
        class="border-none shadow-none"
      >
        <div class="flex flex-row items-center p-4">
          <div class="flex items-center gap-2">
            <img
              :src="post.avatar"
              :alt="post.username"
              class="w-8 h-8 rounded-full"
            />
            <span class="font-semibold">{{ post.username }}</span>
            <span class="text-muted-foreground">• {{ post.timeAgo }}</span>
          </div>
          <button class="ml-auto" @click="onMoreClick">
            <MoreHorizontal class="h-5 w-5" />
          </button>
        </div>

        <!-- 이미지 슬라이드 -->
        <div class="p-0">
          <div class="relative">
            <div class="overflow-hidden">
              <div
                class="flex transition-transform duration-300 ease-in-out"
                :style="{
                  transform: `translateX(-${currentSlides[postIndex] * 100}%)`,
                }"
              >
                <img
                  v-for="(image, index) in post.images"
                  :key="index"
                  :src="image"
                  :alt="'Post ' + (index + 1)"
                  class="w-full h-[400px] object-cover flex-shrink-0"
                />
              </div>
            </div>

            <!-- 슬라이드 버튼 -->
            <button
              v-if="currentSlides[postIndex] > 0"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full"
              @click="handleSlideChange(postIndex, 'prev')"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>

            <button
              v-if="currentSlides[postIndex] < post.images.length - 1"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full"
              @click="handleSlideChange(postIndex, 'next')"
            >
              <ChevronLeft class="h-4 w-4 rotate-180" />
            </button>

            <!-- 슬라이드 인디케이터 -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              <div
                v-for="(_, index) in post.images"
                :key="index"
                :class="[
                  'w-1.5 h-1.5 rounded-full',
                  index === currentSlides[postIndex]
                    ? 'bg-primary'
                    : 'bg-muted',
                ]"
              />
            </div>
          </div>

          <!-- 포스트 내용 -->
          <div class="p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button class="icon-button">
                  <Heart class="h-6 w-6" />
                </button>
                <button class="icon-button">
                  <MessageCircle class="h-6 w-6" />
                </button>
                <button class="icon-button">
                  <Share2 class="h-6 w-6" />
                </button>
              </div>
              <button class="icon-button">
                <Bookmark class="h-6 w-6" />
              </button>
            </div>
            <div>
              <p class="font-semibold">좋아요 {{ post.likes }}개</p>
              <div class="flex gap-2">
                <span class="font-semibold">{{ post.username }}</span>
                <span>{{ post.caption }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.icon-button:focus {
  outline: none;
}
</style>
