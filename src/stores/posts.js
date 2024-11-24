// post.js
import { defineStore } from 'pinia'
import api from '@/axios.js'
import defaultAvatar from '@/assets/no_picture.png'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    currentSlides: [], // 슬라이드 상태 관리
    page: 1,
    size: 10,
    hasMore: true,
    isLoading: false,
  }),

  getters: {
    getPosts: state => state.posts,
  },

  actions: {
    resetPosts() {
      this.posts = [];
      this.page = 1;
      this.hasMore = true;
      this.isLoading = false;
      this.currentSlides = [];
    },

    async fetchPosts() {
      if (this.isLoading || !this.hasMore) return

      this.isLoading = true

      try {
        const response = await api.get('/api/board', {
          params: { page: this.page, size: this.size },
        })

        const fetchedPosts = response.data

        console.log(fetchedPosts)
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
      const response = await api.get(`/api/comment/${boardId}`, {
        params: { page, size },
      })
      return response.data;
    },

    async fetchChildComments(parentId, page = 1, size = 20) {
      const response = await api.get(`/api/comment/child-comments/${parentId}`, {
        params: { page, size },
      })
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
      });
      return response.data // 작성된 답글 데이터를 반환
    },
    // 좋아요 추가
    async addLike(postId) {
      try {
        const response = await api.post('/api/board/like', { boardId: postId });
        const updatedPost = response.data; // 서버에서 반환된 최신 데이터
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.isLiked = true
          post.likes = updatedPost.likesCount; // 서버에서 반환된 최신 좋아요 수
        }
      } catch (error) {
        console.error('좋아요 추가 중 오류 발생:', error);
      }
    },
    // 좋아요 취소
    async deleteLike(postId) {
      try {
        const response = await api.delete('/api/board/like', { data: { boardId: postId } });
        const updatedPost = response.data;
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.isLiked = false
          post.likes = updatedPost.likesCount;
        }
      } catch (error) {
        console.error('좋아요 취소 중 오류 발생:', error);
      }
    }
  },
})
