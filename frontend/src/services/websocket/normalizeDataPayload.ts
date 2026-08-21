import { uint8ArrayToUUID } from './uint8ArrayToUUID'

//  тип данных нужно нормализовать тут, нужно переделать any в нормальный тип
// type PayloadValue =
//     | Uint8Array
//     | {
//           value?: unknown;
//           [key: string]: unknown;
//       }
//     | unknown;

// type DataPayload = Record<string, PayloadValue>;

/**
 * Преобразует Buffer-подобный объект в формат с UUID строками
 *
 * Проходит по всем свойствам объекта и преобразует Uint8Array длиной 16 байт
 * в строковые UUID значения. Это необходимо для совместимости с бэкендом,
 * где UUID могут передаваться в виде массива чисел или буфера.
 */
export function normalizeDataPayload(data: any): any {
  const normalized = { ...data }

  Object.entries(normalized).forEach(([key, value]) => {
    // Костыль так как в беке проблемесы
    const valueToCheck =
      typeof value === 'object' &&
        value !== null &&
        'value' in value
          ? value.value
          : value;

    if (isUUIDBuffer(valueToCheck)) {
      normalized[key] = uint8ArrayToUUID(valueToCheck)
    }
  })

  return normalized
}

/**
 * Проверяет, является ли значение UUID-буфером
 */
function isUUIDBuffer(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array && value.length === 16
}
