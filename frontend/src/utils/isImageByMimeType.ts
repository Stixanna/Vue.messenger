import type { Attachment } from '@/types/messages'

/*
 * Метод проверки является ли файл изображением по mime-type
 * SVG исключается и считается обычным файлом
 */
export function isImageByMimeType(file: Attachment): boolean {
  if (!file?.type) {
    return false
  }

  return file.type.startsWith('image/') && file.type !== 'image/svg+xml'
}
