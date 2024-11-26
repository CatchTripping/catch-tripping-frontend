<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDialogStore } from '@/stores/dialog'
import { usePostsStore } from '@/stores/posts'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogOut } from 'lucide-vue-next'
import defaultAvatar from '@/assets/no_picture.png'
import router from '@/router/index.js'
import api from '../../axios.js'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Pinia Stores
const dialogStore = useDialogStore()
const postsStore = usePostsStore()
const userStore = useUserStore()

// 유저 정보
const userInfo = userStore.userInfo

// 다이얼로그 상태 관리
const openEditProfileDialog = ref(false)
const openChangePhotoDialog = ref(false)

// 프로필 이미지 관리
const photo = ref(userInfo?.profileImage || '/assets/no_picture.png')
const temporaryPhoto = ref(null)
const isLoading = ref(false)
const error = ref(null)

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

// 프로필 편집 다이얼로그 열기
const goToEditProfile = () => {
  openEditProfileDialog.value = true
}

// 사용자 정보 업데이트
const updateUserInfo = async () => {
  const success = await userStore.getUserInfo()
  if (success) {
    photo.value = userStore.userInfo?.profileImage || '/assets/no_picture.png'
  } else {
    console.error('사용자 정보를 업데이트하는 데 실패했습니다.')
  }
}

// 프로필 사진 업로드 핸들러
const handlePhotoUpload = async event => {
  const file = event.target.files?.[0]
  if (file) {
    try {
      error.value = null
      // 이미지 미리보기 설정
      temporaryPhoto.value = URL.createObjectURL(file)
      // 다이얼로그 닫기
      openChangePhotoDialog.value = false
    } catch (err) {
      console.error('이미지 업로드 중 오류:', err)
      error.value = '이미지를 업로드할 수 없습니다.'
    }
  }
}

// 프로필 사진 저장 핸들러
const handleSavePhoto = async () => {
  if (!temporaryPhoto.value) return // 저장할 이미지가 없으면 종료

  try {
    isLoading.value = true
    error.value = null

    // presigned URL 얻기
    const response = await api.get('/api/s3/presigned-url', {
      params: {
        filename: temporaryPhoto.value.split('/').pop(),
        method: 'PUT',
        type: 'profile',
      },
    })

    const { url, key } = response.data

    // S3에 이미지 업로드
    const file = await fetch(temporaryPhoto.value).then(res => res.blob())
    await api.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    })

    // 서버에 프로필 이미지 업데이트 요청
    await api.post('/users/profile-image', {
      imageKey: key,
    })

    // 사용자 정보 업데이트
    await updateUserInfo()

    // 로컬 이미지 업데이트
    photo.value = temporaryPhoto.value
    temporaryPhoto.value = null
    openEditProfileDialog.value = false // 다이얼로그 닫기
  } catch (err) {
    console.error('이미지 저장 중 오류:', err)
    error.value = '이미지를 저장하는 데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 프로필 사진 삭제 핸들러
const handlePhotoDelete = async () => {
  try {
    isLoading.value = true
    error.value = null

    await api.delete('/users/profile-image')
    await updateUserInfo()
    photo.value = '/assets/no_picture.png'
    temporaryPhoto.value = null
  } catch (err) {
    console.error('이미지 삭제 중 오류:', err)
    error.value = '이미지를 삭제하는 데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 프로필 편집 다이얼로그 닫기
const closeEditProfileDialog = () => {
  openEditProfileDialog.value = false
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

    <!-- 프로필 편집 다이얼로그 -->
    <Dialog v-model:open="openEditProfileDialog">
      <DialogContent class="max-w-2xl p-4 space-y-8">
        <DialogHeader>
          <DialogTitle class="text-2xl font-semibold text-center mt-4">
            프로필 편집
          </DialogTitle>
        </DialogHeader>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                :src="temporaryPhoto || photo"
                alt="Profile photo"
                class="rounded-full object-cover w-16 h-16"
              />
            </div>
            <div class="flex flex-col">
              <span class="font-medium">{{ userStore.userInfo?.userName }}</span>
              <Button
                variant="link"
                class="text-blue-500 p-0 h-auto font-normal justify-start"
                @click="openChangePhotoDialog = true"
              >
                사진 변경
              </Button>
            </div>
          </div>

          <!-- 사진 변경 다이얼로그 -->
          <Dialog v-model:open="openChangePhotoDialog">
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
                  @click="openChangePhotoDialog = false"
                >
                  취소
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <!-- 저장 및 나가기 버튼 -->
          <div class="flex justify-end mt-6 gap-2">
            <Button variant="secondary" @click="closeEditProfileDialog">
              나가기
            </Button>
            <Button
              variant="primary"
              :disabled="isLoading || !temporaryPhoto"
              @click="handleSavePhoto"
            >
              저장하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 다른 다이얼로그 컴포넌트 -->
    <Dialog v-if="dialogStore.isDetailPostDialogOpen" />
  </div>
</template>

<style scoped>
.avatar img {
  border-radius: 50%;
}
</style>
