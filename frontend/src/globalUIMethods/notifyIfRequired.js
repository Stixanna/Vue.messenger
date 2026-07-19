import { processNotification } from '@/globalUIMethods/processNotification';


export async function notifyIfRequired(data) {
    // Проверка активности вкладки
    if (!document.hasFocus()) {
        processNotification(data);
        // // Отправка уведомления внутри вкладки
        // processNotification();
        // // Отправка уведомления To SW
        // sendNotificationToSW(data);
    }
}
