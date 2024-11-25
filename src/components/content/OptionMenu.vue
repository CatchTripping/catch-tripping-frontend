<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: Boolean,
})

const emits = defineEmits(['edit', 'delete', 'close'])

const onEdit = () => {
  emits('edit')
}

const onDelete = () => {
  emits('delete')
}

const onClose = () => {
  emits('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-64">
      <button
        class="block w-full text-center px-4 py-2 hover:bg-gray-100 hover:rounded-lg"
        @click="onEdit"
      >
        수정하기
      </button>
      <button
        class="block w-full text-center px-4 py-2 hover:bg-gray-100"
        @click="onDelete"
      >
        삭제하기
      </button>
      <button
        class="block w-full text-center px-4 py-2 hover:bg-gray-100 hover:rounded-lg"
        @click="onClose"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<style scoped></style>
