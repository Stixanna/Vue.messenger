import { FetchFile } from '@/services/messageService';


/**
 * @param {string} fileId - Идентификатор файла
 * @param {boolean} isDownload - Скачать файл или вернуть для отображения.
 ** При значении True файл возвращается с заголовком Content-Disposition: attachment
 ** При значении False файл возвращается с заголовком Content-Disposition: inline.
 * @param {boolean} isThumbnail - Вернуть уменьшенную версию изображения.
 ** Работает только с растровыми изображениями
 ** При значении False файл возвращается в оригинальном размере
 ** Если тип файла не относится к растровым изображениям, то возвращается оригинальный файл
 ** Файл всегда возвращается с заголовком Content-Disposition: inline для встраивания
 * @param {number} thumbnailSize - Ширина thumbnail в пикселях.
 ** Опциональный параметр. По дефолту 256.
 ** Будет применен только в случае isThumbnail = True
  * @returns Blob с содержимым файла.
 */
export async function loadFetchFile(
  fileId: string,
  isDownload = false,
  isThumbnail = false,
  thumbnailSize = 256,
): Promise<Blob> {
  return FetchFile(
    fileId,
    isDownload,
    isThumbnail,
    thumbnailSize,
  );
}
