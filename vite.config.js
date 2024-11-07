import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000, // Vite dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Spring Boot server port
        changeOrigin: true,
        secure: false, // 필요 시 이 옵션 추가
      }
    }
  }
})
