import type { EventPayload } from '@/types/events';

const NOTIFICATION_TEXT = {
  title: 'Chatilka',
  body: {
    new_message: '❗ Новое сообщение!',
    new_notify: '❗ Вы получили новое уведомление',
    new_call: '❗ Вам звонят',
  },
};

/**
 * Обрабатывает браузерное уведомление.
 */
export async function processNotification(
  data: EventPayload,
): Promise<void> {
  const title = data.action === 'message-min'
    ? NOTIFICATION_TEXT.body.new_message
    : NOTIFICATION_TEXT.body.new_notify;

  try {
    if (!window.Notification) {
      console.log('Browser does not support notifications.');
    } else {
      // // Видно ли приложение на экранах
      // const shouldAudioNotification = getNotificationsAllowed();
      // if (shouldAudioNotification) {

      // Воспроизведение звука через аудио-элемент
      // (требует предварительного взаимодействия)
      const audio = new Audio('notification.mp3');

      audio.play().catch(error => {
        console.warn(
          'Не удалось проиграть звук. Проверьте: 1. Доступ к файлу 2. Поддержку браузером 3. Разрешение на звук',
          error,
        );
      });

      // }

      // check if permission is already granted
      if (Notification.permission === 'granted') {
        const notify = new Notification(
          NOTIFICATION_TEXT.title,
          {
            body: title,
          },
        );
      } else {
        // Запрос разрешения и потом отправка уведомления
        Notification.requestPermission()
          .then(permission => {
            if (permission === 'granted') {
              const notify = new Notification(
                NOTIFICATION_TEXT.title,
                {
                  body: title,
                },
              );
            } else {
              console.log('User blocked notifications.');
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  } catch (error) {
    console.error('Error while notification:', error);
  }
}