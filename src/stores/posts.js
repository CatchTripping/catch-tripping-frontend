import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [
      {
        id: 1,
        username: 'engtoontv',
        avatar: '@/assets/placeholder.svg?height=40&width=40',
        timeAgo: '1일',
        images: [
          '@/assets/placeholder.svg?height=600&width=400',
          '@/assets/placeholder.svg?height=600&width=400',
        ],
        likes: 535,
        caption: '👇 자세한 설명 👇',
        comments: [],
      },
      {
        id: 2,
        username: 'traveler123',
        avatar: '@/assets/placeholder.svg?height=40&width=40',
        timeAgo: '3시간',
        images: ['@/assets/placeholder.svg?height=600&width=400'],
        likes: 1024,
        caption: '아름다운 석양 🌅',
        comments: [],
      },
      {
        id: 3,
        username: 'foodie_delight',
        avatar: '@/assets/placeholder.svg?height=40&width=40',
        timeAgo: '5시간',
        images: [
          '@/assets/placeholder.svg?height=600&width=400',
          '@/assets/placeholder.svg?height=600&width=400',
          '@/assets/placeholder.svg?height=600&width=400',
        ],
        likes: 789,
        caption: '오늘의 맛있는 점심 😋🍽️',
        comments: [],
      },
    ],
  }),

  getters: {
    // posts에 대한 getter 추가 가능
    getPosts: state => state.posts,
  },

  actions: {
    // 포스트 관련 actions 추가 가능
    addPost(post) {
      this.posts.push(post)
    },
    removePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId)
    },
  },
})
