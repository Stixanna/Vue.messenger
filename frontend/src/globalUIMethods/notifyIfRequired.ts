import { processNotification } from '@/globalUIMethods/processNotification';

interface NotificationEvent {
  type: string;
  data: Record<string, unknown>;
}

export async function notifyIfRequired(
  data: NotificationEvent,
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