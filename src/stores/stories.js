import { defineStore } from 'pinia'

export const useStoriesStore = defineStore('stories', {
  state: () => ({
    stories: [
      {
        id: 1,
        username: 'Deon Bauer',
        avatar: '@/assets/placeholder.svg?height=60&width=60',
      },
      {
        id: 2,
        username: 'Alphonse Jacobson',
        avatar: '@/assets/placeholder.svg?height=60&width=60',
      },
      {
        id: 3,
        username: 'Rupert Pearson',
        avatar: '@/assets/placeholder.svg?height=60&width=60',
      },
      {
        id: 4,
        username: 'Corina Gay',
        avatar: '@/assets/placeholder.svg?height=60&width=60',
      },
      {
        id: 5,
        username: 'Cathy Ayala',
        avatar: '@/assets/placeholder.svg?height=60&width=60',
      },
      {
        id: 6,
        username: 'Noelle Meadows',
        avatar: '@/assets/placeholder.svg?height=60&width=60',
      },
      {
        id: 7,
        username: 'Pasquale Gilbert',
        avatar: '@/assets/placeholder.svg?height=60&width=60',
      },
      {
        id: 8,
        username: 'Stacey Greer',
        avatar: '@/assets/placeholder.svg?height=60&width=60',
      },
    ],
  }),

  getters: {
    // stories에 대한 getter
    getStories: state => state.stories,
  },

  actions: {
    // 스토리 추가
    addStory(story) {
      this.stories.push(story)
    },
    // 스토리 제거
    removeStory(storyId) {
      this.stories = this.stories.filter(story => story.id !== storyId)
    },
  },
})
