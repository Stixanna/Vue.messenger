
const uiEvents = new Map();

/**
 * Метод для инициализации события
 * @param {string} event 
 * @param {{}} payload 
 */
export function emit(event, payload) {
    const cbs = uiEvents.get(event);
    if (!cbs) return;

    cbs.forEach(cb => cb(payload, event));
}

/**
 * Метод для обработки пришедшего события
 * @param {string} event пример: '<obj.name>:<obj.activity>'
 * @param {{}} cb data необходимая для обработки ивента
 */
export function on(event, cb) {
    if (!uiEvents.has(event)) {
        uiEvents.set(event, []);
    }

    uiEvents.get(event).push(cb);
}
