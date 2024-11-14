// stores/user.js (Pinia store)
import { defineStore } from 'pinia'
import api from '../axios.js'
import router from '@/router/index.js'
import validationState from 'lodash/seq.js'
import errors from 'lodash/seq.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null, // 유저 정보
  }),
  actions: {
    // 회원가입
    async registerUser({ userName, userPassword, userEmail }) {
      try {
        const response = await api.post('/users/register', {
          userName,
          userPassword,
          userEmail,
        })

        if (response.data.status === 200) {
          alert('회원가입 성공')
          router.push('/login')
        }
      } catch (error) {
        const errorMessage = error.response?.data?.description || '회원가입 실패. 다시 시도해 주세요.';
        alert(errorMessage);

        // 중복된 필드에 맞춰 상태 업데이트
        if (errorMessage.includes('아이디')) {
          validationState.value.username = false;
          errors.value.username = '이미 사용 중인 아이디입니다.';
        } else if (errorMessage.includes('이메일')) {
          validationState.value.useremail = false;
          errors.value.useremail = '이미 사용 중인 이메일입니다.';
        }
      }
    },
    // 아이디 중복 체크
    async checkUsername(username) {
      try {
        const response = await api.get('users/check-username', {
          params: { userName: username },
        })

        return response.data.data.isAvailable;
      } catch (error) {
        // if (import.meta.env.MODE === 'development') {
        //   console.error('Username check error:', error);
        // }
        return false;
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
        // if (import.meta.env.MODE === 'development') {
        //   console.error('Email check error:', error);
        // }
        return false;
      }
    },

    // 로그인 처리: 서버에 로그인 요청을 보내고 성공 시 세션 체크 시작
    async login(username, password, rememberMe) {
      try {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('remember-me', rememberMe ? 'true' : 'false');

        const response = await api.post('/authenticate', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // 인증에 성공한 경우만 사용자 정보 요청
        if (response.status === 200) {
          const userInfoSuccess = await this.getUserInfo();
          if (userInfoSuccess) {
            return true;
          }
        } else {
          throw new Error(response.data?.description || '로그인에 실패했습니다.');
        }
      } catch (error) {
        alert(error.response?.data?.description || '로그인 실패. 다시 시도해 주세요.');
        this.userInfo = null;
        return false;
      }
    },

    // 사용자 정보 가져오기
    async getUserInfo() {
      try {
        const response = await api.get('/users/userinfo')
        this.userInfo = response.data.data;
        return true;
      } catch (error) {
        this.userInfo = null;
        alert(error.response?.data?.description || '사용자 정보를 불러오는데 실패했습니다.');
        return false;
      }
    },

    // 로그아웃 처리: 서버에서 세션 종료하고, 쿠키에서 세션 ID 제거
    async logout() {
      try {
        await api.post('/logout', {})
        this.userInfo = null
      } catch (error) {
      }
    },

    // 로컬 스토리지나 쿠키에서 세션 정보 복원
    async loadSessionFromCookies() {
      try {
        const response = await api.get('/users/check');
        if (response.data.isAuthenticated) {
          await this.getUserInfo(); // 유저 정보 가져오기
          return true;
        }
        this.userInfo = null;
        return false;
      } catch (error) {
        this.userInfo = null;
        return false;
      }
    }
  },
  getters: {
    isLoggedIn(state) {
      if (import.meta.env.MODE === 'development') {
        // console.log('isLoggedIn check:', !!state.userInfo)
      }
      return !!state.userInfo // 유저 정보가 있으면 로그인 상태
    },
  },
})
