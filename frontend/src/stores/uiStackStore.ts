import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UiStackItem {
  id: string
  onClose: () => void
}

export const useUiStackStore = defineStore('uiStack', () => {
  const stack = ref<UiStackItem[]>([])

  function push(item: UiStackItem): void {
    stack.value.push(item)
  }

  function remove(id: string): void {
    const item = stack.value.find((item) => item.id === id)
    if (item) {
      item.onClose()
    }
    stack.value = stack.value.filter((item) => item.id !== id)
  }

  function getLast(): UiStackItem | undefined {
    return stack.value.at(-1)
  }

  return {
    stack,
    push,
    remove,
    getLast,
  }
})
