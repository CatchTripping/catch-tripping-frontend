// stores/user.js (Pinia store)
import { defineStore } from 'pinia'
import api from '../axios.js'
import router from '@/router/index.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null, // 유저 정보
    sessionCheckInterval: null, // 세션 체크 인터벌 ID
  }),
  actions: {
    //세션 체크 시작 : 로그인 상태일 때 1분마다 세션 상태 확인
    startSessionCheck() {
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval)
      }

      this.sessionCheckInterval = setInterval(async () => {
        if (this.isLoggedIn) {
          try {
            // 세션 확인을 위해 서버에 /users/userinfo 요청
            const response = await api.get('/user/userinfo')
            if (!response.data) {
              this.handleSessionExpired()
            }
          } catch (error) {
            // 인증 오류가 발생하면 세션 만료 처리
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
              this.handleSessionExpired()
            }
          }
        } else {
          this.stopSessionCheck()
        }
      }, 60000) // 1분
    },

    // 세션 체크 중지
    stopSessionCheck() {
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval)
        this.sessionCheckInterval = null
      }
    },

    // 세션 만료 처리: 세션 체크 중지하고 로그인 페이지로 리다이렉트
    handleSessionExpired() {
      this.stopSessionCheck()
      this.userInfo = null
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    },

    // 로그인 처리: 서버에 로그인 요청을 보내고 성공 시 세션 체크 시작
    async login(username, password) {
      try {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await api.post('/authenticate', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })

        if (response.data.status === 'success') {
          const userInfoSuccess = await this.getUserInfo()

          if (!userInfoSuccess) {
            this.userInfo = null
            throw new Error('Failed to load user info')
          }

          this.startSessionCheck() // 로그인 성공 시 세션 체크 시작
          return true
        } else {
          throw new Error('Login Failed')
        }
      } catch (error) {
        console.error('Login error:', error)
        this.userInfo = null
        throw error
      }
    },

    // 사용자 정보 가져오기
    async getUserInfo() {
      try {
        const response = await api.get('/users/userinfo')

        if (response.data) {
          this.userInfo = response.data
          return true
        }
        this.userInfo = null
        return false
      } catch (error) {
        this.userInfo = null
        throw error
      }
    },

    // 로그아웃 처리: 서버에서 세션 종료하고, 쿠키에서 세션 ID 제거
    async logout() {
      try {
        await api.post('/logout', {})
        this.userInfo = null;
        this.stopSessionCheck()
      } catch (error) {
        console.error('Logout Failed:', error)
      }
    },

    // 로컬 스토리지나 쿠키에서 세션 정보 복원
    async loadSessionFromCookies() {
        try {
          const result = await this.getUserInfo()
          if (result) {
            this.startSessionCheck()
          }
          return result
        } catch (error) {
          this.userInfo = null
          console.error('Failed to load user info:', error)
          return false
        }
    },
  },
  getters: {
    isLoggedIn(state) {
      console.log('isLoggedIn check:', !!state.userInfo)
      return !!state.userInfo // 유저 정보가 있으면 로그인 상태
    },
  },
})
