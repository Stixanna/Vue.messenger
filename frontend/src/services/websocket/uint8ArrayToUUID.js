/**
 * Преобразует Buffer-подобный объект в UUID строку
 * @param {{data: number[]}} bufferObj
 * @returns {string}
 */
export function uint8ArrayToUUID(bufferData) {
    const bytes = new Uint8Array(bufferData);

    const hex = [...bytes]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20)
    ].join('-');
}
