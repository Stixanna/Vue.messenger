// import { getCurrentLanguage } from "../vars/stores/currentLanguageStore";


// Функция для форматирования времени
export function formatTimestamp(timestamp) {
    let date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        date = new Date(timestamp.slice(0, 23) + "Z"); // Обрезаем лишнее и добавляем 'Z' (UTC)
    }

    // Корректируем на локальное время
    let localOffset = date.getTimezoneOffset();
    let localTime = new Date(date.getTime() - localOffset);

    // Форматируем время в "чч:мм"
    let formattedTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Форматируем дату в "дд/мм/гггг"
    let formattedDate = localTime.toLocaleDateString('ru-RU');

    let formattedTimestamp = {
        time: formattedTime,
        datetime: `${formattedDate} ${formattedTime}`
    };

    return formattedTimestamp;
}
