import { uint8ArrayToUUID } from "./uint8ArrayToUUID";


/**
 * Преобразует Buffer-подобный объект в формат с UUID строками
 * 
 * Проходит по всем свойствам объекта и преобразует Uint8Array длиной 16 байт
 * в строковые UUID значения. Это необходимо для совместимости с бэкендом,
 * где UUID могут передаваться в виде массива чисел или буфера.
 * 
 * @param {Object} data - Объект содержащий буфер-подобные данные
 * @returns {Object} - Объект с нормализованными UUID значениями
 */
export function normalizeDataPayload(data) {
    const normalized = { ...data };

    Object.entries(normalized).forEach(([key, value]) => {
        // Костыль так как в беке проблемесы
        const valueToCheck = value.value || value

        if (isUUIDBuffer(valueToCheck)) {
            normalized[key] = uint8ArrayToUUID(valueToCheck);
        }
    });

    return normalized;
}

/**
 * Проверяет, является ли значение UUID-буфером
 */
function isUUIDBuffer(value) {
    return value instanceof Uint8Array && value.length === 16;
}