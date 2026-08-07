import { formatDate } from "@/utils/formatDate";
// import { getCurrentLanguage } from "../vars/stores/currentLanguageStore";


// метод возвращающий количество прошедшего с timestamp времени / дату
// timestamp => ISO-date format
export function formatRelativeTime(timestamp) {
    const now = new Date();
    const messageDate = new Date(timestamp);
    // если timestamp не ISO-date то вернуть это
    if (isNaN(messageDate.getTime())) {
        return '';
    }

    // Корректируем на локальное время
    let localOffset = messageDate.getTimezoneOffset();
    let localTime = new Date(messageDate.getTime() - localOffset);

    const diffInMinutes = (now - localTime) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;

    if (diffInMinutes < 1) 
        return `только что`;
    else if (diffInMinutes < 60) 
        return `${Math.floor(diffInMinutes)} мин. назад`;
    else if (diffInHours < 24) 
        return `${Math.floor(diffInHours)} ч. назад`;
    else
        return formatDate(timestamp, true);
}
