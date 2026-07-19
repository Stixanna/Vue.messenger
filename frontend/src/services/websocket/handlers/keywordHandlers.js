import { normalizeDataPayload } from "@/services/websocket/normalizeDataPayload";

import { useRoomsStore } from '@/stores/roomsStore';
import { useKeywordsStore } from '@/stores/keywordsStore';


const tagActionHandlers = {
    set: handleKwSet,
    unset: handleKwUnset,
    rename: handleKwRename,
    order: handleKwOrder,
};

/**
 * Метод для маршрутизации события тегов по типу действия,
 * предварительно нормализуя входящие данные.
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 *
 * @param {{
 *     action: string,
 *     data: Object
 * }} payload - Сырые данные для обработки.
 *
 * @returns {{}} Нормализованные данные события.
 */
export function routeKwEvent(payload) {
    const normalizedData =
        normalizeDataPayload(payload.data);

    const actionHandler =
        tagActionHandlers[payload.action];

    if (!actionHandler) {
        console.warn(
            'Unknown keyword action:',
            payload.action
        );

        return normalizedData;
    }

    actionHandler(normalizedData);

    return normalizedData;
}

function handleKwSet(data) {
    const { room_id, name, order } = data;
    const keywordsStore = useKeywordsStore();

    const kwToSet = { name, order };
    keywordsStore.addRoomKeyword(room_id, kwToSet);

    console.log('Backend keyword set:', data);
}

function handleKwUnset(data) {
    const { name, room_id } = data;
    const keywordsStore = useKeywordsStore();

    keywordsStore.removeRoomKeyword(room_id, {name});

    console.log('Backend keyword unset:', data);
}

function handleKwRename(data) {
    const { room_id, old_name, new_name } = data;
    const keywordsStore = useKeywordsStore();

    // update tag in tag list
    keywordsStore.updateRoomKeywordName(room_id, data);

    console.log('Backend keyword renamed:', data);
}

function handleKwOrder(data) {
    const { room_id, name, normilized, order_num } = data;
    const roomsStore = useRoomsStore();
    const keywordsStore = useKeywordsStore();

    const room = roomsStore.getRoomById(room_id);
    const keywords = [...room.keywords];

    const keyword = keywords.find(item => item.id ?? item.name === name);
    keyword.order = order_num; 

    const keywordsResorted = keywords.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

    keywordsStore.updateRoomKeywords(room.id, keywordsResorted);
    
    console.log('Backend keyword ordered:', data);
}
