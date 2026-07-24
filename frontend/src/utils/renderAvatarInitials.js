// метод возвращающий инициалы первых слов строки
export function renderAvatarInitials(name, is_one_char) {
  let nameParts = name.trim().split(/\s+/)
  // Проверка количества слов
  let avatarInitials =
    nameParts.length > 1
      ? // Если слов несколько
        nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase() // вывод первых букв двух первых слов
      : // Если слово одно
        nameParts[0].length > 1 && !is_one_char
        ? (nameParts[0].charAt(0) + nameParts[0].charAt(1)).toUpperCase() // вывод первых 2 букв слова
        : nameParts[0].charAt(0).toUpperCase() // Если буква одна, вывод только 1 буквы

  return avatarInitials
}
