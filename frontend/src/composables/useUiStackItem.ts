import { onMounted, onUnmounted } from 'vue'
import { useUiStackStore } from '@/stores/uiStackStore'

export function useUiStackItem(id: string, onClose: () => void) {
  const uiStackStore = useUiStackStore()

  onMounted(() => {
    uiStackStore.push({
      id,
      onClose,
    })
  })

  onUnmounted(() => {
    uiStackStore.remove(id)
  })
}
