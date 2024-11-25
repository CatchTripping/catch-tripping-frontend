<script setup>
import { computed, onMounted } from 'vue'
import { useDialogStore } from '@/stores/dialog'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-vue-next'
import defaultAvatar from '@/assets/no_picture.png'
import router from '@/router/index.js'

// Pinia Stores
const dialogStore = useDialogStore()
const postsStore = usePostsStore()
const userStore = useUserStore()

// 유저 정보
const userInfo = userStore.userInfo

// 로그아웃 함수
const logout = async () => {
  await userStore.logout()
  await router.push('/login')
}

// 내가 작성한 게시물
const myPosts = computed(() => postsStore.myPosts)
const myPostCount = computed(() => postsStore.myPosts.length)

// 초기 데이터 로드
onMounted(async () => {
  postsStore.resetMyPosts() // 기존 데이터 초기화
  await postsStore.fetchMyPosts() // 내가 작성한 게시물 API 호출
})

// 게시물 열기
const openPostDialog = postId => {
  dialogStore.openDetailPostDialog(postId) // 상세 Dialog 열기
}

// 프로필 편집으로 이동
const goToEditProfile = () => {
  router.push('/edit-profile')
}
</script>

<template>
  <div class="container max-w-4xl mx-auto px-4 py-8">
    <header
      class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8"
    >
      <div class="avatar w-20 h-20 md:w-36 md:h-36">
        <img
          :src="userInfo?.profileImage || defaultAvatar"
          alt="User Avatar"
          class="w-full h-full rounded-full object-cover"
        />
      </div>
      <div class="flex-1">
        <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <h1 class="text-xl font-semibold">
            {{ userInfo?.userName || '사용자 이름' }}
          </h1>
          <Button @click="goToEditProfile">프로필 편집</Button>
          <Button variant="destructive" @click="logout">
            <LogOut class="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
        <p class="text-gray-500">
          {{ userInfo?.userEmail || 'user@example.com' }}
        </p>
        <div class="flex gap-4 md:gap-8 mb-4">
          <div class="text-sm">
            <span class="font-semibold">{{ myPostCount }}</span> 게시물
          </div>
        </div>
      </div>
    </header>

    <!-- 내 게시물 리스트 -->
    <div class="grid grid-cols-3 gap-1 md:gap-1">
      <button
        v-for="post in myPosts"
        :key="post.id"
        class="relative aspect-square w-full overflow-hidden"
        @click="openPostDialog(post.id)"
      >
        <img
          :src="post.images[0]"
          :alt="post.caption"
          class="w-full h-full object-cover hover:opacity-90 transition-opacity"
        />
      </button>
    </div>

    <!-- Dialog 컴포넌트 -->
    <Dialog v-if="dialogStore.isDetailPostDialogOpen" />
  </div>
</template>

<style scoped>
.avatar img {
  border-radius: 50%;
}
</style>
