# catch-tripping-frontend

# Tailwind (CSS)
[테일윈드로 간편하게 사용하기](https://v2.tailwindcss.com/docs/display)  
Rapidly build modern websites without ever leaving your HTML
![tailwind.png](tailwind.png)

### 사용
```vue
<div class="space-y-4 ...">
  <span class="block ...">1</span>
  <span class="block ...">2</span>
  <span class="block ...">3</span>
</div>
```

# Shadcn (컴포넌트)
[샤든으로 간편하게 사용하기](https://www.shadcn-vue.com/docs/components/accordion.html)  
Re-usable components built with Radix Vue, and Tailwind CSS.
![shadcn-vue](shadcn-vue.png)
### 설치
`npx shadcn-vue@latest add input`
### 사용
```vue
<script setup>
  import { Button } from '@/components/ui/button'
</script>

<template>
  <Button>Button</Button>
</template>
```

# Lucide (아이콘)
[루시드 로 간편하게 사용하기](https://lucide.dev/icons/)  
![lucide.png](lucide.png)
```vue
<script setup>
import { BluetoothOff } from 'lucide-vue-next';
</script>

<template>
  <BluetoothOff />
</template>
```

# 구현 된 경로

- /
- /login 
- /signup


# 시작 명령어 모음

## 서버 설정
See [Vite Configuration Reference](https://vite.dev/config/).

## 프로젝트 설치

```sh
pnpm install
```

## 개발 전용 컴파일 핫로드

```sh
pnpm dev
```

## 프로덕션 빌드

```sh
pnpm build
```

## 유닛 테스트 [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

## 문법 검사 [ESLint](https://eslint.org/)

```sh
pnpm eslint . --fix
```

## 이쁘게 포맷 

```shell
pnpm prettier --write src/
```
