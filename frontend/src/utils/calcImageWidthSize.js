/**
 * Рассчитывает размеры изображения с ограничением только по ширине.
 * Высота изменяется пропорционально.
 *
 * @param {number} originalWidth Исходная ширина изображения.
 * @param {number} originalHeight Исходная высота изображения.
 * @param {number} maxWidth Максимальная ширина.
 * @returns {{width: number, height: number}}
 */
export function calcImageWidthSize(
  originalWidth,
  originalHeight,
  maxWidth = 250,
) {
  const width = originalWidth ?? maxWidth;
  const height = originalHeight ?? maxWidth;

  if (width <= maxWidth) {
    return { width, height };
  }

  const ratio = maxWidth / width;

  return {
    width: maxWidth,
    height: Math.round(height * ratio),
  };
}