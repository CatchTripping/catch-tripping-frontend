// stores/user.js (Pinia store)
import { defineStore } from 'pinia'
import api from '../axios.js'
import router from '@/router/index.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null, // 유저 정보
  }),
  actions: {
    // 회원가입
    async registerUser({ userName, userPassword, userEmail }) {
      try {
        await api.post('/users/register', {
          userName,
          userPassword,
          userEmail,
        })
        alert('회원가입 성공')
        router.push('/login')
      } catch (error) {
        console.error('Registration Failed: ', error)
        alert('회원가입 실패. 다시 시도해 주세요.')
      }
    },
    // 아이디 중복 체크
    async checkUsername(username) {
      try {
        const response = await api.get('users/check-username', {
          params: { userName: username },
        })
        return response.data.data.isAvailable // true : 사용 가능, false : 중복
      } catch (error) {
        console.error('Username check error:', error)
        return false
      }
    },

    // 이메일 중복 체크
    async checkEmail(userEmail) {
      try {
        const response = await api.get('users/check-email', {
          params: { userEmail },
        })
        return response.data.data.isAvailable
      } catch (error) {
        console.error('Email check error:', error)
        return false
      }
    },

    // 로그인 처리: 서버에 로그인 요청을 보내고 성공 시 세션 체크 시작
    async login(username, password, rememberMe) {
      try {
        const params = new URLSearchParams()
        params.append('username', username)
        params.append('password', password)
        params.append('remember-me', rememberMe ? 'true' : 'false')

        const response = await api.post('/authenticate', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })

        if (response.data.status === 'success') {
          const userInfoSuccess = await this.getUserInfo()

          if (!userInfoSuccess) {
            this.userInfo = null
            throw new Error('Failed to load user info')
          }
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

        if (response.data.data) {
          this.userInfo = response.data.data
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
        this.userInfo = null
      } catch (error) {
        console.error('Logout Failed:', error)
      }
    },

    // 로컬 스토리지나 쿠키에서 세션 정보 복원
    async loadSessionFromCookies() {
      try {
        const response = await api.get('/users/check')
        if (response.data.data.isAuthenticated) {
          await this.getUserInfo()
          return true
        }
        return false
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn('No active session found. Redirecting to login.')
        }
        this.userInfo = null
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
