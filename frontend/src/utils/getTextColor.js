// import * as md5 from 'blueimp-md5';


/**
 * Метод получения цвета из первых 6 символов строки
 * @param {String} hash_text Строка из которой получить цвет
 * @returns {color} Цвет полученный из первых 6 символов строки
 */
export function getTextColor( hash_text ) {
    // const text = hash_text;

    // // Вычисляем MD5 хеш
    // const hash = md5(text);
    
    // // Берем первые 6 символов хеша
    // const color = '#' + hash.substring(0, 6);

    // Проверяем, является ли строка допустимой шестнадцатеричной строкой
    const hexRegex = /^[0-9a-fA-F]+$/;
    const text = hash_text.substring(0, 6);
    
    // Если строка не соответствует регулярному выражению, возвращаем дефолтный цвет
    if (!hexRegex.test(text)) {
        const default_color = getComputedStyle(document.documentElement).getPropertyValue('--avatar-color');
        console.error('Undefined or incorrect params: ', hash_text)
        return default_color; 
    }
    
    // Берем первые 6 символов строки и добавляем # в начале
    const color = '#' + hash_text.substring(0, 6);
    
    return color;
}
