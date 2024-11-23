// post.js
import { defineStore } from 'pinia';
import api from '@/axios.js';

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
    async fetchPosts() {
      if (this.isLoading || !this.hasMore) return;

      this.isLoading = true;

      try {
        const response = await api.get('/api/board', {
          params: { page: this.page, size: this.size },
        });

        const fetchedPosts = response.data;

        if (fetchedPosts.length < this.size) {
          this.hasMore = false;
        }

        this.posts.push(...fetchedPosts.map(post => ({
          id: post.boardId,
          username: post.userName,
          avatar: post.profileImage || '/default-avatar.png',
          timeAgo: `${post.createdDate} ${post.createdAt}`,
          images: post.imageUrls,
          likes: post.likesCount,
          caption: post.content,
          isLiked: post.isLiked,
          comments: [],
        })));

        // 슬라이드 상태 초기화
        this.currentSlides = this.posts.map(() => 0);
        this.page += 1;
      } catch (error) {
        console.error('게시물 불러오기 중 오류 발생:', error);
      } finally {
        this.isLoading = false;
      }
    },

    updateCurrentSlide(postIndex, direction) {
      if (direction === 'prev') {
        this.currentSlides[postIndex] = Math.max(0, this.currentSlides[postIndex] - 1);
      } else if (direction === 'next') {
        this.currentSlides[postIndex] = Math.min(
          this.posts[postIndex].images.length - 1,
          this.currentSlides[postIndex] + 1
        );
      }
    },
  },
});
