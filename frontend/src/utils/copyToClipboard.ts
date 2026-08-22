export async function copyToClipboard(
  text: string
) : Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Error: copy by Clipboard API:', error);
    }

    return;
  }

  // Фоллбэк для старых/мобильных браузеров
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.setAttribute('readonly', '');

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand('copy');

    if (!successful) {
      console.error("Error: execCommand('copy') did not work");
    }
  } catch (error) {
    console.error('Error: copy by execCommand:', error);
  } finally {
    textarea.remove();
  }
}