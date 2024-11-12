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
  const userStore = useUserStore();

  // 초기 로그인 상태 복구
  if (!userStore.isLoggedIn) {
    await userStore.loadSessionFromCookies();
  }

  // 로그인 상태에서 /login이나 /로 접근할 때 /home으로 리다이렉트
  if (userStore.isLoggedIn && (to.path === "/login" || to.path === "/")) {
    return next("/home");
  }

  // 인증이 필요한 페이지에 접근하는 경우 로그인 여부 확인
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next("/login");
  }

  // 비회원 전용 페이지에 로그인된 사용자가 접근하려는 경우 홈으로 리다이렉트
  if (to.meta.requiresGuest && userStore.isLoggedIn) {
    return next("/home");
  }

  next(); // 다른 모든 경우에 원래 목적지로 이동
});


export default router
