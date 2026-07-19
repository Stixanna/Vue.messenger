/**
 * Метод для создания всплывающего попапа
 * @param {HTMLDivElement}  container Контейнер в котором выводить попап
 * @param {string}  message Выводимый текст сообщения
 */
export function showPopup( container, message ) {
    const prevPopup = container.querySelector(".popup");
    if (prevPopup)
        prevPopup.remove();

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = message;

    container.appendChild(popup);

    // Убираем через 2 секунды
    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 300); // Удаляем после анимации
    }, 2000);
}
