import { formatDate } from "@/utils/formatDate";
// import { getCurrentLanguage } from "../vars/stores/currentLanguageStore";


export function formatRelativeTime(
	timestamp: string,
): string {
    const messageDate = new Date(timestamp);

    if (isNaN(messageDate.getTime())) {
        return '';
    }

    const diffInMinutes =
        (Date.now() - messageDate.getTime()) / 60_000;
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
