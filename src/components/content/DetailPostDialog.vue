<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight, Smile } from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialog'
import { usePostsStore } from '@/stores/posts.js'
import defaultAvatar from '@/assets/no_picture.png'

const dialogStore = useDialogStore()
const postsStore = usePostsStore()
const selectedPost = computed(() => dialogStore.selectedPost)

const currentImageIndex = ref(0)
const newComment = ref('')
const comments = ref([])
const childComments = ref({})
const currentPage = ref(1)
const isLoadingComments = ref(false)

// 댓글 불러오기
const fetchComments = async () => {
  if (!selectedPost.value) return

  isLoadingComments.value = true
  try {
    const parentComments = await postsStore.fetchParentComments(
      selectedPost.value.boardId,
      currentPage.value
    )
    comments.value.push(...parentComments)
    currentPage.value++
  } catch (error) {
    console.error('댓글 불러오기 오류:', error)
  } finally {
    isLoadingComments.value = false
  }
}

watch(
  () => dialogStore.selectedPost,
  async (post) => {
    if (post) {
      comments.value = [] // 이전 댓글 초기화
      currentPage.value = 1 // 페이지 초기화
      await fetchComments()
    }
  }
)

// 대댓글 불러오기
const fetchChildComments = async (parentId) => {
  if (childComments.value[parentId]?.isLoading) return

  if (!childComments.value[parentId]) {
    childComments.value[parentId] = { replies: [], isLoading: true }
  } else {
    childComments.value[parentId].isLoading = true
  }

  try {
    const replies = await postsStore.fetchChildComments(parentId)
    childComments.value[parentId].replies = replies
  } catch (error) {
    console.error('대댓글 불러오기 오류:', error)
  } finally {
    childComments.value[parentId].isLoading = false
  }
}

// 댓글 작성
const handleComment = async () => {
  if (!newComment.value.trim() || !selectedPost.value) return

  try {
    const comment = await postsStore.addComment(selectedPost.value.boardId, newComment.value.trim())
    comments.value.unshift(comment);
    newComment.value = ''
  } catch (error) {
    console.error('댓글 작성 오류:', error)
  }
}

// 대댓글 작성
const handleReply = async (parentId, replyContent) => {
  if (!replyContent.trim()) return

  try {
    const reply = await postsStore.addChildComment(parentId, replyContent)
    if (!childComments.value[parentId]) {
      childComments.value[parentId] = { replies: [] }
    }
    childComments.value[parentId].replies.push(reply)
  } catch (error) {
    console.error('대댓글 작성 오류:', error)
  }
}

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
              :src="selectedPost.profileImage || defaultAvatar"
              alt="User Avatar"
            />
            <div>
              <h2 class="font-semibold text-sm">
                {{ selectedPost.userName }}
              </h2>
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
        <div class="flex flex-col flex-1">
          <!-- 댓글 표시 -->
          <div class="flex-1 overflow-y-auto p-4">
            <div v-for="comment in comments" :key="comment.commentId" class="mb-4">
              <div class="flex items-start gap-2">
                <img
                  class="h-8 w-8 rounded-full"
                  :src="comment.avatar || defaultAvatar"
                  alt="User Avatar"
                />
                <div>
                  <div>
                    <span class="font-semibold text-sm">{{ comment.userId }}</span>
                    <span class="text-sm">{{ comment.content }}</span>
                  </div>
                  <div class="text-xs text-muted-foreground">{{ comment.createdAt }}</div>
                  <button @click="fetchChildComments(comment.commentId)" class="text-xs text-blue-500">
                    답글 보기
                  </button>
                  <div v-if="childComments[comment.commentId]?.replies">
                    <div
                      v-for="reply in childComments[comment.commentId].replies"
                      :key="reply.commentId"
                      class="flex items-start gap-2 mt-2"
                    >
                      <img
                        class="h-8 w-8 rounded-full"
                        :src="reply.avatar || defaultAvatar"
                        alt="User Avatar"
                      />
                      <div>
                        <span class="font-semibold text-sm">{{ reply.username }}</span>
                        <span class="text-sm">{{ reply.content }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button v-if="isLoadingComments" class="text-sm">댓글 불러오는 중...</button>
          </div>

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
  </div>
</template>
