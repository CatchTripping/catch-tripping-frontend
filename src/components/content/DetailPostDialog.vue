<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight, Smile, Heart } from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialog'
import { usePostsStore } from '@/stores/posts.js'
import defaultAvatar from '@/assets/no_picture.png'

const dialogStore = useDialogStore()
const postsStore = usePostsStore()
const selectedPost = computed(() => dialogStore.selectedPost)

const currentImageIndex = ref(0)
const newComment = ref('')
const selectedReply = ref(null) // 답글 대상
const comments = ref([])
const childComments = ref({})
const currentPage = ref(1)
const isLoadingComments = ref(false)
const showReplies = ref({}) // 답글 보이기 상태

// 좋아요 추가 및 취소 처리
const toggleLike = async () => {
  try {
    if (selectedPost.value.isLikedByLogInUser) {
      await postsStore.deleteLike(selectedPost.value.boardId)
      selectedPost.value.isLikedByLogInUser = false // 좋아요 상태 업데이트
      selectedPost.value.likesCount -= 1 // 좋아요 수 감소
    } else {
      await postsStore.addLike(selectedPost.value.boardId)
      selectedPost.value.isLikedByLogInUser = true // 좋아요 상태 업데이트
      selectedPost.value.likesCount += 1 // 좋아요 수 증가
    }
  } catch (error) {
    console.error('좋아요 처리 오류:', error)
  }
}

// 댓글 불러오기
const fetchComments = async () => {
  if (!selectedPost.value) return

  isLoadingComments.value = true
  try {
    const parentComments = await postsStore.fetchParentComments(
      selectedPost.value.boardId,
      currentPage.value,
    )
    comments.value.push(...parentComments)
    currentPage.value++
  } catch (error) {
    console.error('댓글 불러오기 오류:', error)
  } finally {
    isLoadingComments.value = false
  }
}

// 답글 보이기/숨기기
const toggleReplies = async parentId => {
  if (showReplies.value[parentId]) {
    // 숨기기
    showReplies.value[parentId] = false
  } else {
    // 보이기
    showReplies.value[parentId] = true
    if (
      !childComments.value[parentId] ||
      childComments.value[parentId].length === 0
    ) {
      try {
        const replies = await postsStore.fetchChildComments(parentId)
        childComments.value[parentId] = replies
      } catch (error) {
        console.error('대댓글 불러오기 오류:', error)
      }
    }
  }
}

watch(
  () => dialogStore.selectedPost,
  async post => {
    if (post) {
      comments.value = [] // 이전 댓글 초기화
      currentPage.value = 1 // 페이지 초기화
      await fetchComments()
    }
  },
)

// 대댓글 불러오기
const fetchChildComments = async parentId => {
  try {
    const replies = await postsStore.fetchChildComments(parentId)
    childComments.value[parentId] = replies
  } catch (error) {
    console.error('대댓글 불러오기 오류:', error)
  }
}

// 댓글 작성
const handleComment = async () => {
  if (!newComment.value.trim() || !selectedPost.value) return

  try {
    if (selectedReply.value) {
      // 대댓글 작성
      const replyContent = newComment.value.replace(/^@\S+\s/, '')
      const reply = await postsStore.addChildComment(
        selectedPost.value.boardId,
        replyContent,
        selectedReply.value,
      )
      if (reply === '댓글 저장 성공') {
        // 답글 보기 상태 확인 후 처리
        if (!showReplies.value[selectedReply.value]) {
          showReplies.value[selectedReply.value] = true // 답글 보기 상태로 설정
        }

        // 답글 목록 갱신
        await fetchChildComments(selectedReply.value)

        // 답글 개수 증가
        const parentComment = comments.value.find(
          comment => comment.commentId === selectedReply.value,
        )
        if (parentComment) {
          parentComment.childCommentCount += 1
        }

        selectedReply.value = null // 답글 대상 초기화
      }
    } else {
      // 일반 댓글 작성
      await postsStore.addComment(
        selectedPost.value.boardId,
        newComment.value.trim(),
      )
      // 댓글 목록 다시 호출
      comments.value = [] // 기존 댓글 초기화
      currentPage.value = 1 // 페이지 초기화
      await fetchComments() // 댓글 다시 불러오기
    }
    newComment.value = '' // 입력 필드 초기화
  } catch (error) {
    console.error('댓글 작성 오류:', error)
  }
}

// 답글 달기 클릭
const handleReplyClick = (userName, commentId) => {
  selectedReply.value = commentId
  newComment.value = `@${userName} `
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
          variant="ghost"
          size="icon"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          @click="prevImage"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <button
          v-if="currentImageIndex < selectedPost.imageUrls.length - 1"
          variant="ghost"
          size="icon"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
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
          <!-- 댓글 영역 -->
          <div class="flex-1 overflow-y-auto p-4 max-h-[492.4px]">
            <div
              v-for="comment in comments"
              :key="comment.commentId"
              class="mb-4"
            >
              <div class="flex items-start gap-2">
                <img
                  class="h-8 w-8 rounded-full"
                  :src="comment.profileImage || defaultAvatar"
                  alt="User Avatar"
                />
                <div>
                  <div>
                    <span class="font-semibold text-sm">{{
                      comment.userName
                    }}</span>
                    <span class="text-sm">{{ comment.content }}</span>
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ comment.createdAt }}
                  </div>
                  <div class="flex flex-col gap-1 mt-2">
                    <!-- 답글 달기 -->
                    <div>
                      <button
                        @click="
                          handleReplyClick(comment.userName, comment.commentId)
                        "
                        class="text-xs font-bold text-gray-500"
                      >
                        답글 달기
                      </button>
                    </div>
                    <!-- 답글 보기 -->
                    <div
                      v-if="comment.childCommentCount > 0"
                      class="flex items-center gap-2"
                    >
                      <span class="h-px w-8 bg-gray-400"></span>
                      <button
                        @click="toggleReplies(comment.commentId)"
                        class="text-xs font-bold text-gray-500"
                      >
                        {{
                          showReplies[comment.commentId]
                            ? '답글 숨기기'
                            : `답글 보기(${comment.childCommentCount})`
                        }}
                      </button>
                    </div>
                  </div>

                  <div v-if="showReplies[comment.commentId]">
                    <div
                      v-for="reply in childComments[comment.commentId]"
                      :key="reply.commentId"
                      class="flex items-start gap-2 mt-2"
                    >
                      <img
                        class="h-8 w-8 rounded-full"
                        :src="reply.profileImage || defaultAvatar"
                        alt="User Avatar"
                      />
                      <div>
                        <span class="font-semibold text-sm">{{
                          reply.userName
                        }}</span>
                        <span class="text-sm">{{ reply.content }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button v-if="isLoadingComments" class="text-sm">
              댓글 불러오는 중...
            </button>
          </div>
          <!-- 좋아요 및 댓글 아이콘 -->
          <div class="p-4 flex items-center gap-4">
            <button @click="toggleLike">
              <Heart
                class="h-6 w-6"
                :class="{ 'fill-black': selectedPost.isLikedByLogInUser }"
              />
            </button>
            <span>좋아요 {{ selectedPost.likesCount }}개</span>
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
