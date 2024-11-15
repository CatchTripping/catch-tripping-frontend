import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    isCreatePostDialogOpen: false,
  }),
  actions: {
    openCreatePostDialog() {
      this.isCreatePostDialogOpen = true
    },
    closeCreatePostDialog() {
      this.isCreatePostDialogOpen = false
    },
  },
})
