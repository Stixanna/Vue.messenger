/**
 * Метод форматирования текста для кликабельности ссылок
 * @param {String} text Текст взятый из джейсона сообщения
 * @returns {parts} Возвращает части для вставки: текст и ссылки в html формате
 */
export function formatTextWithLinks(text) {
  if (!text) {
    return [];
  }

  const urlRegex =
    /((https?:\/\/|www\.|\/\/)[^\s()<>]+[^\s\)\]})>]+)/g;

  const parts = [];

  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;

    if (start > lastIndex) {
      parts.push({
        type: 'text',
        value: text.slice(lastIndex, start),
      });
    }

    parts.push({
      type: 'link',
      value: url,
    });

    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      value: text.slice(lastIndex),
    });
  }

  return parts;
}