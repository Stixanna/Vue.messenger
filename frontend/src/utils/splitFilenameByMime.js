/**
 * Популярные MIME-типы и соответствующие расширения.
 */
export const MIME_EXTENSION_MAP = {
  // images
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/avif': 'avif',
  'image/tiff': 'tiff',

  // video
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
  'video/x-matroska': 'mkv',
  'video/mpeg': 'mpeg',
  'video/3gpp': '3gp',
  'video/x-flv': 'flv',

  // audio
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/webm': 'weba',
  'audio/aac': 'aac',
  'audio/flac': 'flac',
  'audio/mp4': 'm4a',

  // documents
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'text/html': 'html',
  'text/css': 'css',
  'text/javascript': 'js',
  'application/json': 'json',
  'application/xml': 'xml',
  'text/xml': 'xml',
  'text/csv': 'csv',

  // microsoft office
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',

  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',

  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',

  // archives
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/vnd.rar': 'rar',
  'application/x-7z-compressed': '7z',
  'application/gzip': 'gz',
  'application/x-tar': 'tar',

  // executables / binaries
  'application/octet-stream': 'bin',

  // fonts
  'font/woff': 'woff',
  'font/woff2': 'woff2',
  'font/ttf': 'ttf',
  'font/otf': 'otf',

  // other
  'application/x-shockwave-flash': 'swf',
  'application/rtf': 'rtf',
  'application/epub+zip': 'epub',
}

/**
 * Метод для отделения имени файла от расширения в зависимости от mimeType
 * @param {string} filename - Имя файла
 * @param {string} mimeType - MIME type
 */
export function splitFilenameByMime(filename, mimeType) {
  const expectedExt = MIME_EXTENSION_MAP[mimeType]

  // если MIME не известен → не трогаем вообще
  if (!expectedExt) {
    return {
      base: filename,
      extension: '',
    }
  }

  const lower = filename.toLowerCase()

  if (lower.endsWith(`.${expectedExt}`)) {
    return {
      base: filename.slice(0, -(expectedExt.length + 1)),
      extension: `.${expectedExt}`,
    }
  }

  // если имя не совпадает с MIME (редкий кейс)
  return {
    base: filename,
    extension: '',
  }
}
