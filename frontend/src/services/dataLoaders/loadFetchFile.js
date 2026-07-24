import { FetchFile } from '@/services/messageService';


/**
 * Метод фетча фетча файла с параметрами
 * @param {string} file_id - Идентификатор файла
 * @param {boolean} is_download - Должен ли файл скачаться или просто вернуться.
 ** Опциональный параметр. По дефолту false.
 ** При значении True файл возвращается с заголовком Content-Disposition: attachment
 ** При значении False файл возвращается с заголовком Content-Disposition: inline.
 * @param {boolean} is_thumbnail - Должен ли вернуться уменьшеный файл для предпросмотра.
 ** Опциональный параметр. По дефолту false.FetchFile
 ** Работает только с растровыми изображениями
 ** При значении True возвращает уменьшеное до размера thumbnail_size изображение. Если thumbnail_size не указан, выставляется стандартное для этого параметра значение
 ** При значении False файл возвращается в оригинальном размере
 ** Если тип файла не относится к растровым изображениям, то возвращается оригинальный файл
 ** Файл всегда возвращается с заголовком Content-Disposition: inline для встраивания
 * @param {number} thumbnail_size - Размер по ширине для файла предпросмотра
 ** Опциональный параметр. По дефолту 256.
 ** Будет применен только в случае thumbnail = True
  * @returns {Promise<Blob | undefined>} blob
 */
export async function loadFetchFile( file_id, is_download, is_thumbnail, thumbnail_size ) {
    const response = await FetchFile(file_id, is_download, is_thumbnail, thumbnail_size);
    try {
        // Получаем blob
        const responseBlob = await response;

        return responseBlob;

    } catch (error) {
        console.error('Error loading file:', error);
    } 
}
