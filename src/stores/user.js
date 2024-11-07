// stores/user.js (Pinia store)
import { defineStore } from 'pinia'
import Cookies from 'js-cookie' // 쿠키 관리를 위한 라이브러리

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null, // 유저 정보
  }),
  actions: {
    // 로그인 처리: 서버로 로그인 요청하고, 세션 ID를 쿠키에 저장
    async login(username, password) {
      try {
        // 서버에 로그인 요청
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })

        if (!response.ok) {
          throw new Error('Login failed')
        }

        const data = await response.json()

        // 로그인 성공 시 유저 정보와 세션을 쿠키에 저장
        this.userInfo = data.user
        Cookies.set('sessionId', data.sessionId, { expires: 7 }) // 세션 ID를 쿠키에 저장 (7일간 유효)

        // 서버에서 받은 유저 정보를 추가 처리할 수 있음
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    // 로그아웃 처리: 서버에서 세션 종료하고, 쿠키에서 세션 ID 제거
    async logout() {
      try {
        // 서버에 로그아웃 요청
        await fetch('/api/logout', { method: 'POST' })

        // 로컬 스토어와 쿠키에서 세션 정보 제거
        this.userInfo = null
        Cookies.remove('sessionId') // 쿠키에서 세션 ID 삭제
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    // 로컬 스토리지나 쿠키에서 세션 정보 복원
    loadSessionFromCookies() {
      const sessionId = Cookies.get('sessionId')
      if (sessionId) {
        // 세션 ID가 쿠키에 있으면 서버에 해당 세션 정보를 요청하여 유저 정보 로드
        fetch(`/api/session-info?sessionId=${sessionId}`)
          .then(response => response.json())
          .then(data => {
            this.userInfo = data.user
          })
          .catch(error => {
            console.error('Failed to load session:', error)
          })
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.userInfo // 유저 정보가 있으면 로그인 상태
    },
  },
})
