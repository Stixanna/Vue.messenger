import { useEventListener } from '@vueuse/core'

export function useEscapeKey(handler: (event: KeyboardEvent) => void) {
  useEventListener(window, 'keydown', (event) => {
    if (event.key !== 'Escape') {
      return
    }

    handler(event)
  })
}
