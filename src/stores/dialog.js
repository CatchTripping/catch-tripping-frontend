import { defineStore } from 'pinia'
import api from '@/axios.js'

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    isCreatePostDialogOpen: false,
    isDetailPostDialogOpen: false,
    isEditPostDialogOpen: false,
    selectedPostId: null,
    selectedPost: null,
  }),
  actions: {
    openCreatePostDialog() {
      this.isCreatePostDialogOpen = true
    },
    closeCreatePostDialog() {
      this.isCreatePostDialogOpen = false
    },

    async openDetailPostDialog(postId) {
      this.isDetailPostDialogOpen = true
      this.selectedPostId = postId

      try {
        const response = await api.get(`/api/board/${postId}`)
        this.selectedPost = response.data
      } catch (error) {
        console.error('게시물 상세 정보 불러오기 오류:', error)
      }
    },

    closeDetailPostDialog() {
      this.isDetailPostDialogOpen = false
      this.selectedPostId = null
      this.selectedPost = null
    },
    openEditPostDialog(post) {
      console.log('openEditPostDialog called with post:', post)
      this.isEditPostDialogOpen = true
      this.selectedPost = {
        ...post,
      }
      console.log('selectedPost after update:', this.selectedPost)
    },
    closeEditPostDialog() {
      this.isEditPostDialogOpen = false
      this.selectedPost = null
    },
  },
})
