import { normalizeDataPayload } from '@/services/websocket/normalizeDataPayload'

import { useRoomsStore } from '@/stores/roomsStore'
import { useKeywordsStore } from '@/stores/keywordsStore'
import type { EventPayload } from '@/types/events'

interface KeywordSetEventData {
  room_id: string
  name: string
  order: number
}

interface KeywordUnsetEventData {
  room_id: string
  name: string
}

interface KeywordRenameEventData {
  room_id: string
  old_name: string
  new_name: string
}

interface KeywordOrderEventData {
  room_id: string
  name: string
  normilized: string
  order_num: number
}

/**
 * Маршрутизирует события ключевых слов по типу действия.
 *
 * Входной payload соответствует общему формату
 * WebSocket-события. Данные предварительно нормализуются,
 * после чего передаются соответствующему обработчику.
 */
export function routeKwEvent(payload: EventPayload): Record<string, unknown> {
  const normalizedData = normalizeDataPayload(payload.data)

  switch (payload.action) {
    case 'set':
      handleKwSet(normalizedData)
      break

    case 'unset':
      handleKwUnset(normalizedData)
      break

    case 'rename':
      handleKwRename(normalizedData)
      break

    case 'order':
      handleKwOrder(normalizedData)
      break

    default:
      console.warn('Unknown keyword action:', payload.action)
  }

  return normalizedData
}

function handleKwSet(data: KeywordSetEventData): void {
  const { room_id, name, order } = data

  const keywordsStore = useKeywordsStore()

  const keywordToSet = {
    name,
    order,
  }

  keywordsStore.addRoomKeyword(room_id, keywordToSet)

  console.log('Backend keyword set:', data)
}

function handleKwUnset(data: KeywordUnsetEventData): void {
  const { room_id, name } = data

  const keywordsStore = useKeywordsStore()

  keywordsStore.removeRoomKeyword(room_id, { name })

  console.log('Backend keyword unset:', data)
}

function handleKwRename(data: KeywordRenameEventData): void {
  const { room_id, old_name, new_name } = data

  const keywordsStore = useKeywordsStore()

  keywordsStore.updateRoomKeywordName(room_id, data)

  console.log('Backend keyword renamed:', data)
}

function handleKwOrder(data: KeywordOrderEventData): void {
  const { room_id, name, order_num } = data

  const roomsStore = useRoomsStore()

  const room = roomsStore.getRoomById(room_id)

  if (!room) {
    return
  }

  const keywords = [...room.keywords]

  const keyword = keywords.find((item) => item.name === name)

  if (!keyword) {
    return
  }

  keyword.order = order_num

  const keywordsResorted = keywords.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))

  roomsStore.updateRoomKeywords(room.id, keywordsResorted)

  console.log('Backend keyword ordered:', data)
}
