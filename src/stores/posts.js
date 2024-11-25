// post.js
import { defineStore } from 'pinia'
import api from '@/axios.js'
import defaultAvatar from '@/assets/no_picture.png'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    myPosts: [], // 내가 작성한 게시물
    currentSlides: [], // 슬라이드 상태 관리
    page: 1,
    size: 10,
    hasMore: true,
    isLoading: false,
  }),

  getters: {
    getPosts: state => state.posts,
    getMyPosts: state => state.myPosts,
  },

  actions: {
    resetMyPosts() {
      this.myPosts = []
      this.page = 1
      this.hasMore = true
      this.isLoading = false
    },
    resetPosts() {
      this.posts = []
      this.page = 1
      this.hasMore = true
      this.isLoading = false
      this.currentSlides = []
    },

    async fetchPosts() {
      if (this.isLoading || !this.hasMore) return

      this.isLoading = true

      try {
        const response = await api.get('/api/board', {
          params: { page: this.page, size: this.size },
        })

        const fetchedPosts = response.data

        if (fetchedPosts.length < this.size) {
          this.hasMore = false
        }

        this.posts.push(
          ...fetchedPosts.map(post => ({
            id: post.boardId,
            username: post.userName,
            avatar: post?.profileImage || defaultAvatar,
            timeAgo: `${post.createdDate} ${post.createdAt}`,
            images: post.imageUrls,
            likes: post.likesCount,
            caption: post.content,
            isLiked: post.isLikedByLogInUser,
            comments: [],
          })),
        )

        // 슬라이드 상태 초기화
        this.currentSlides = this.posts.map(() => 0)
        this.page += 1
      } catch (error) {
        console.error('게시물 불러오기 중 오류 발생:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchMyPosts() {
      if (this.isLoading || !this.hasMore) return

      this.isLoading = true
      try {
        const response = await api.get('/api/myBoard', {
          params: { page: this.page, size: this.size },
        })

        const fetchedMyPosts = response.data

        if (fetchedMyPosts.length < this.size) {
          this.hasMore = false
        }

        this.myPosts.push(
          ...fetchedMyPosts.map(post => ({
            id: post.boardId,
            username: post.userName,
            avatar: post?.profileImage || defaultAvatar,
            timeAgo: `${post.createdDate} ${post.createdAt}`,
            images: post.imageUrls,
            likes: post.likesCount,
            caption: post.content,
            isLiked: post.isLikedByLogInUser,
          })),
        )
        this.page += 1
      } catch (error) {
        console.error('내 게시물 불러오기 중 오류 발생:', error)
      } finally {
        this.isLoading = false
      }
    },

    updateCurrentSlide(postIndex, direction) {
      if (direction === 'prev') {
        this.currentSlides[postIndex] = Math.max(
          0,
          this.currentSlides[postIndex] - 1,
        )
      } else if (direction === 'next') {
        this.currentSlides[postIndex] = Math.min(
          this.posts[postIndex].images.length - 1,
          this.currentSlides[postIndex] + 1,
        )
      }
    },
    async fetchParentComments(boardId, page = 1, size = 20) {
      try {
        const response = await api.get(`/api/comment/${boardId}`, {
          params: { page, size },
        })
        return response.data
      } catch (error) {
        console.error('댓글 불러오기 오류:', error)
        throw error
      }
    },
    async fetchChildComments(parentId, page = 1, size = 20) {
      const response = await api.get(
        `/api/comment/child-comments/${parentId}`,
        {
          params: { page, size },
        },
      )
      return response.data
    },

    async addComment(boardId, content) {
      const response = await api.post(`/api/comment`, { boardId, content })
      return response.data
    },

    async addChildComment(boardId, content, parentId) {
      const response = await api.post(`/api/comment`, {
        boardId,
        content,
        parentCommentId: parentId,
      })
      return response.data // 작성된 답글 데이터를 반환
    },
    // 좋아요 추가
    async addLike(postId) {
      try {
        await api.post('/api/board/like', { boardId: postId })
        const post = this.posts.find(p => p.id === postId)
        if (post) {
          post.isLiked = true
          post.likes += 1
        }
      } catch (error) {
        console.error('좋아요 추가 중 오류 발생:', error)
      }
    },
    // 좋아요 취소
    async deleteLike(postId) {
      try {
        await api.delete('/api/board/like', { data: { boardId: postId } })
        const post = this.posts.find(p => p.id === postId)
        if (post) {
          post.isLiked = false
          post.likes -= 1
        }
      } catch (error) {
        console.error('좋아요 취소 중 오류 발생:', error)
      }
    },
    updatePost(updatedPostData) {
      const index = this.posts.findIndex(
        post => post.id === updatedPostData.boardId,
      )
      if (index !== -1) {
        this.posts[index] = {
          ...this.posts[index],
          caption: updatedPostData.content, // 수정된 내용 반영
        }
      }
    },
    async deletePost(postId) {
      try {
        await api.delete(`/api/board/${postId}`)
        this.posts = this.posts.filter(post => post.id !== postId)
      } catch (error) {
        console.error('게시물 삭제 중 오류 발생:', error)
        throw error
      }
    },
  },
})
