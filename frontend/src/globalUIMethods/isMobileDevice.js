/**
 * Метод проверки того что приложение открыто с мобильного устройства
 */
export function isMobileDevice() {
    // в navigator.userAgent присутствуют ключевые слова
    const isMobileKeywordsInUserAgent = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(navigator.userAgent);
    // ширина экрана меньше чем 3 колонки вместе взятые
    const isWindowHasMobileWidth = window.screen.width < 1000;

    const isMobile = isMobileKeywordsInUserAgent || isWindowHasMobileWidth;
        
    return isMobile;
}