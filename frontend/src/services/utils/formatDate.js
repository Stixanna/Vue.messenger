// import { getDateFormat } from '../vars/stores/dateFormatStore';


/**
 * Метод для преобразования цифр таймштампа в читаемый вид
 * @param {string} timestamp Таймштамп
 * @param {bool} is_readable_var - Опциональный параметр, если передан - возвращается день недели
 * @returns {string} Возвращает день недели / дату 
 */
export function formatDate( timestamp, is_readable_var ) {
    let date;

    if (typeof timestamp === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(timestamp)) {
        // если передана только дата без времени — парсим вручную, чтобы не зависеть от UTC
        const [year, month, day] = timestamp.split('-').map(Number);
        date = new Date(year, month - 1, day); // ← локальное время // month - 1 js особенность 
    } else {
        // если полный timestamp или миллисекунды
        date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) {
        return '??.??';
    }

    // const format = getDateFormat();

    // if (format === 'iso') {
    //     return formatDateIso(date);
    // }

    const now = new Date();

    // Убираем часы для чистого сравнения даты
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const dryDiffInDays = Math.floor((nowOnly - dateOnly) / (1000 * 60 * 60 * 24));
    const diffInDays = Math.abs(dryDiffInDays);

    let is_sheduled;
    if(dryDiffInDays < 0)
        is_sheduled = true;

    if (diffInDays === 0) {
        return 'Сегодня';
    } else if (diffInDays === 1) {
        return !is_sheduled ? 'Вчера' : 'Завтра';
    } else if (diffInDays < 7) {
        if(is_readable_var){
            const weekday = date.toLocaleDateString('ru-RU', { weekday: 'short' });
            const capitalized_weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
            return capitalized_weekday; // en-US "Monday" ru-RU "Понедельник"
        }
        else {
            const full_date_nums = formatDateRu(date, true);
            return full_date_nums; 
        }
    } else {
        if(is_readable_var){
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

/**
 * Метод для преобразования даты в читаемый вид
 * @param {Date} date Дата 
 * @param {bool} is_weekday - Опциональный параметр, если true то рядом с датой будет день недели
 * @returns {string} Возвращает дату и день недели
 */
function formatDateRu( date, is_weekday ) {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    // день недели (сокращённый)
    const weekday = d.toLocaleDateString('ru-RU', { weekday: 'short' });
    const capitalized_weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

    const formatted_date = `${day}.${month}.${year}`;
    
    return `${formatted_date}${is_weekday ? `, ${capitalized_weekday}` : ''}`;
}

// /**
//  * Метод для преобразования даты в iso вид
//  * @param {Date} date Дата 
//  * @returns {string} Возвращает дату в формате iso
//  */
// function formatDateIso( date ) {
//     const d = new Date(date);

//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const year = d.getFullYear();

//     const formatted_date = `${year}-${month}-${day}`;

//     return formatted_date;
// }
