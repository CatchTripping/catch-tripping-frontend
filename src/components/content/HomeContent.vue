<script setup>
import { computed, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts.js'
import { useDialogStore } from '@/stores/dialog.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from 'lucide-vue-next'

const postsStore = usePostsStore()
const dialogStore = useDialogStore()

// 상태 계산: 슬라이드 상태는 Pinia의 상태와 동기화
const currentSlides = computed(() => postsStore.currentSlides)

// 페이지 로딩 시 게시물 데이터 가져오기
onMounted(() => {
  postsStore.fetchPosts()
})

// 좋아요 추가 및 취소 처리
const toggleLike = async post => {
  try {
    if (post.isLiked) {
      await postsStore.deleteLike(post.id)
    } else {
      await postsStore.addLike(post.id)
    }
  } catch (error) {
    console.error('좋아요 처리 오류:', error)
  }
}

// 슬라이드 변경 함수
const handleSlideChange = (postIndex, direction) => {
  postsStore.updateCurrentSlide(postIndex, direction)
}

// 더보기 버튼 클릭 이벤트 (추후 구현 가능)
const onMoreClick = () => {
  console.log('더보기 버튼 클릭')
}
</script>

<template>
  <div class="space-y-6 p-6 max-w-[600px]">
    <div class="space-y-6">
      <Card
        v-for="(post, postIndex) in postsStore.getPosts"
        :key="post.id"
        class="border-none shadow-none"
      >
        <!-- 게시물 헤더 -->
        <CardHeader class="flex flex-row items-center p-4">
          <div class="flex items-center gap-2">
            <img
              :src="post.avatar"
              :alt="post.username"
              class="w-8 h-8 rounded-full"
            />
            <span class="font-semibold">{{ post.username }}</span>
            <span class="text-muted-foreground">• {{ post.timeAgo }}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="ml-auto"
            @click="onMoreClick"
          >
            <MoreHorizontal class="h-5 w-5" />
          </Button>
        </CardHeader>

        <!-- 이미지 슬라이드 -->
        <CardContent class="p-0">
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
                  :alt="'Post Image ' + (index + 1)"
                  class="w-full h-[400px] object-cover flex-shrink-0"
                />
              </div>
            </div>

            <!-- 슬라이드 버튼 -->
            <Button
              v-if="currentSlides[postIndex] > 0"
              variant="ghost"
              size="icon"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              @click="handleSlideChange(postIndex, 'prev')"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <Button
              v-if="currentSlides[postIndex] < post.images.length - 1"
              variant="ghost"
              size="icon"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              @click="handleSlideChange(postIndex, 'next')"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>

            <!-- 슬라이드 인디케이터 -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              <div
                v-for="(image, index) in post.images"
                :key="index"
                :class="[
                  'w-2 h-2 rounded-full',
                  index === currentSlides[postIndex]
                    ? 'bg-primary'
                    : 'bg-muted',
                ]"
              />
            </div>
          </div>
        </CardContent>

        <!-- 포스트 내용 -->
        <div class="p-4 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <Button variant="ghost" size="icon" @click="toggleLike(post)">
                <Heart
                  class="h-6 w-6"
                  :class="{ 'fill-black': post.isLiked }"
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                @click="() => dialogStore.openDetailPostDialog(post.id)"
              >
                <MessageCircle class="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div>
            <p class="font-semibold">좋아요 {{ post.likes }}개</p>
            <div class="flex gap-2">
              <span class="font-semibold">{{ post.username }}</span>
              <span>{{ post.caption }}</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- 로딩 상태 -->
      <div v-if="postsStore.isLoading" class="text-center py-4">
        <span>게시물을 불러오는 중입니다...</span>
      </div>

      <!-- 더 이상 게시물이 없을 때 -->
      <div
        v-if="!postsStore.hasMore && !postsStore.isLoading"
        class="text-center py-4"
      >
        <span>더 이상 게시물이 없습니다.</span>
      </div>
    </div>
  </div>
</template>
