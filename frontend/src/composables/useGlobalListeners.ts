import { useEscapeKey } from './keyboard/useEscapeKey'
import { useUiStackStore } from '@/stores/uiStackStore'

export function useGlobalListeners() {
  const uiStackStore = useUiStackStore()

  useEscapeKey(() => {
    const last = uiStackStore.getLast()
    if (last) {
      uiStackStore.remove(last.id)
    }
  })
}
