import { loadCurrentInfo } from '@/services/dataLoaders/loadCurrentInfo';
import { initWebSocket } from '@/services/websocket/websocketService';
import { sseEventListener } from '@/services/sseEventListener/sseEventListenerService';

/**
 * Инициализирует авторизованную главную страницу.
 */
export async function initializeChat()
: Promise<void> {
  await loadCurrentInfo();

  sseEventListener(true);
  initWebSocket(true);
}