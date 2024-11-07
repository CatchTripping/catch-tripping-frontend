import { defineStore } from 'pinia'

export const useStoriesStore = defineStore('stories', {
  state: () => ({
    stories: [
      {
        id: 1,
        username: '10h13m',
        avatar: '/placeholder.svg?height=60&width=60',
      },
      {
        id: 2,
        username: 'moredore...',
        avatar: '/placeholder.svg?height=60&width=60',
      },
      {
        id: 3,
        username: 'gospqslek',
        avatar: '/placeholder.svg?height=60&width=60',
      },
      {
        id: 4,
        username: 'dev_ouk',
        avatar: '/placeholder.svg?height=60&width=60',
      },
      {
        id: 5,
        username: 'j.hye.e',
        avatar: '/placeholder.svg?height=60&width=60',
      },
      {
        id: 6,
        username: '_0.25_',
        avatar: '/placeholder.svg?height=60&width=60',
      },
      {
        id: 7,
        username: 's.jin_122',
        avatar: '/placeholder.svg?height=60&width=60',
      },
      {
        id: 8,
        username: 's2pearl',
        avatar: '/placeholder.svg?height=60&width=60',
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
