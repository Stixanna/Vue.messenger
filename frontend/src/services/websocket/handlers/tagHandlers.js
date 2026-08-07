import { normalizeDataPayload } from "@/services/websocket/normalizeDataPayload";
import { updateRoomListWithData } from "@/utils/updateRoomListWithData";
import { useRoomsStore } from '@/stores/roomsStore';
import { useTagsStore } from '@/stores/tagsStore';


const tagActionHandlers = {
    set: handleTagSet,
    unset: handleTagUnset,
    rename: handleTagRename,
    delete: handleTagDelete,
    order: handleTagOrder,
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
export function routeTagEvent(payload) {
    const normalizedData =
        normalizeDataPayload(payload.data);

    const actionHandler =
        tagActionHandlers[payload.action];

    if (!actionHandler) {
        console.warn(
            'Unknown tag action:',
            payload.action
        );

        return normalizedData;
    }

    actionHandler(normalizedData);

    return normalizedData;
}

function handleTagSet(data) {
    const { room_id, tag_id, tag_name, order_num, is_shared, user_id } = data;
    const tagsStore = useTagsStore();

    const tagToSet = { room_id, tag_id, tag_name, is_shared, user_id };
    tagsStore.addRoomTag(room_id, tagToSet);

    console.log('Backend tag set:', data);
}

function handleTagUnset(data) {
    const { room_id, tag_id, tag_name } = data;
    const tagsStore = useTagsStore();

    tagsStore.removeRoomTag(room_id, {tag_id, tag_name});

    console.log('Backend tag unset:', data);
}

function handleTagRename(data) {
    const { tag_id, old_name, new_name } = data;
    const tagsStore = useTagsStore();

    // update tag in tag list
    tagsStore.updateTagName(data);

    // rename tag in room list глобально по всем комнатам
    updateRoomListWithData({...data, tag_rename: true});

    console.log('Backend tag renamed:', data);
}

function handleTagDelete(data) {
    console.log('Backend tag deleted:', data);
}

function handleTagOrder(data) {
    const { room_id, tag_id, tag_name, normilized, order_num } = data;
    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoomById(room_id);
    const roomTags = [...room.tags];

    const tag = roomTags.find(item => item.id ?? item.tag_id === tag_id);
    tag.order = order_num; 

    const tagsResorted = roomTags.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

    roomsStore.updateRoomTags(room.id, tagsResorted);
    
    console.log('Backend tag ordered:', data);
}
