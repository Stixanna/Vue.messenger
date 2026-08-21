 /**
 * Создаёт всплывающее уведомление внутри указанного контейнера.
 *
 * @param container - Контейнер, в котором отображается попап.
 * @param message - Текст сообщения.
 */
export function showPopup(
  container: HTMLElement,
  message: string,
): void {
  const prevPopup = container.querySelector<HTMLElement>('.popup');

  if (prevPopup) {
    prevPopup.remove();
  }

  const popup = document.createElement('div');

  popup.className = 'popup';
  popup.textContent = message;

  container.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = '0';

    setTimeout(() => {
      popup.remove();
    }, 300);
  }, 2000);
}