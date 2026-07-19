// import { getNotificationsAllowed } from "../vars/stores/isNotificationsAllowedStore";


const NOTIFICATION_TEXT = {
    title: 'Chatilka',
    body: {
        new_message: '❗ Новое сообщение!',
        new_notify: '❗ Вы получили новое уведомление',
        new_call: '❗ Вам звонят',
    },
};


export async function processNotification(data) {
    const title = data.type === 'message-min' ? NOTIFICATION_TEXT.body.new_message : NOTIFICATION_TEXT.body.new_notify;
    try {
        if (!window.Notification) {
            console.log('Browser does not support notifications.');
        } else {
            // // Видно ли приложение на экранах
            // const shouldAudioNotification = getNotificationsAllowed();
            // if(shouldAudioNotification){
                // Воспроизведение звука через аудио-элемент (требует предварительного взаимодействия)
                const audio = new Audio('notification.mp3');
                audio.play().catch(e => {
                    console.warn('Не удалось проиграть звук. Проверьте: 1. Доступ к файлу 2. Поддержку браузером 3. Разрешение на звук', e);
                });
            // }
            
            // check if permission is already granted
            if (Notification.permission === 'granted') {
                // Отправка уведомления
                var notify = new Notification(NOTIFICATION_TEXT.title, {
                    body: title,
                    // icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/500px-Information_icon.svg.png',
                });
            } else {
                // Запрос разрешения и потом отправка уведомления
                Notification.requestPermission().then(function (p) {
                    if (p === 'granted') {
                        // show notification here
                        var notify = new Notification(NOTIFICATION_TEXT.title, {
                            body: title,
                            // icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/500px-Information_icon.svg.png',
                        });
                    } else {
                        console.log('User blocked notifications.');
                    }
                }).catch(function (err) {
                    console.error(err);
                });
            }
        }
    } catch (error) {
        console.error('Error while notification:', error);
    }
}
