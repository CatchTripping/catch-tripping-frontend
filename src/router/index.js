import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import { useUserStore } from '@/stores/user.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: to => {
        const userStore = useUserStore()
        // 로그인 여부에 따라 리다이렉트
        return userStore.isLoggedIn ? '/home' : '/login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }, // 로그인하지 않은 사용자만 접근 가능
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore()
        // 로그인 상태일 경우 홈으로 리다이렉트
        if (userStore.isLoggedIn) {
          next('/home')
        } else {
          next()
        }
      }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // 인증된 사용자만 접근 가능
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { requiresGuest: true }
    },
  ],
})

// 네비게이션 가드 추가
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  try {
    // 이미 로그인된 상태면 세션을 다시 확인하지 않음
    if (!userStore.isLoggedIn) {
      const hasSession = await userStore.loadSessionFromCookies()
      console.log('Session check result:', hasSession)  // 세션 유효성 확인
    }

    // 인증이 필요하지만 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      next('/login')
      return
    }

    // 로그인하지 않은 사용자만 접근 가능한 페이지에 로그인된 사용자가 접근하는 경우
    // 메인 페이지로 리다이렉트
    if (to.meta.requiresGuest && userStore.isLoggedIn) {
      next('/home')
      return
    }

    // 모든 조건을 통과하면 원래 목적지로 이동
    next()
  } catch (error) {
    console.error('Navigation guard error:', error)
    next('/login')
  }
})

export default router
