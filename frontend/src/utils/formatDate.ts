import { useSettingsStore } from '@/stores/settingsStore';


export function formatDate(
    timestamp: string | number,
    returnWeekday = false
): string {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
        return '';
    }

    const settingsStore = useSettingsStore();

    const format = settingsStore.dateFormat;

    if (format === 'iso') {
        return formatDateIso(date);
    }

    const now = new Date();

    // Убираем часы для чистого сравнения даты
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const dryDiffInDays = Math.floor(
        (nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24)
    );
    const diffInDays = Math.abs(dryDiffInDays);

    let is_sheduled;
    if(dryDiffInDays < 0)
        is_sheduled = true;

    if (diffInDays === 0) {
        return 'Сегодня';
    } else if (diffInDays === 1) {
        return !is_sheduled ? 'Вчера' : 'Завтра';
    } else if (diffInDays < 7) {
        if(returnWeekday){
            const weekday = date.toLocaleDateString('ru-RU', { weekday: 'short' });
            const capitalized_weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
            return capitalized_weekday; // en-US "Monday" ru-RU "Понедельник"
        }
        else {
            const full_date_nums = formatDateRu(date, true);
            return full_date_nums; 
        }
    } else {
        if(returnWeekday){
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
            }); // e.g. "March 27"
        } 
        else{
            const full_date_nums = formatDateRu(date);
            return full_date_nums; 
        }
        
    }
}

function formatDateRu(
    date: Date,
    isWeekday = false
): string {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    // день недели (сокращённый)
    const weekday = d.toLocaleDateString('ru-RU', { weekday: 'short' });
    const capitalized_weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

    const formatted_date = `${day}.${month}.${year}`;
    
    return `${formatted_date}${isWeekday ? `, ${capitalized_weekday}` : ''}`;
}

/**
 * Метод для преобразования даты в iso вид
 * @param {Date} date Дата 
 * @returns {string} Возвращает дату в формате iso
 */
function formatDateIso(
    date: Date
): string {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    const formatted_date = `${year}-${month}-${day}`;

    return formatted_date;
}
