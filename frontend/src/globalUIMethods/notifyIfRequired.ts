import { processNotification } from '@/globalUIMethods/processNotification';
import type { EventPayload } from '@/types/events';

export async function notifyIfRequired(
  data: EventPayload,
): Promise<void> {
  // Проверка активности вкладки
  if (!document.hasFocus()) {
    processNotification(data);

    // // Отправка уведомления внутри вкладки
    // processNotification();

    // // Отправка уведомления To SW
    // sendNotificationToSW(data);
  }
}