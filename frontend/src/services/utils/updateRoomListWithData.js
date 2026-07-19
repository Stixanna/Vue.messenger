import { formatRelativeTime } from '@/services/utils/formatRelativeTime';
import { loadRoomList } from '@/services/dataLoaders/loadRoomList';
import { useUsersStore } from '@/stores/usersStore';
import { useRoomsStore } from '@/stores/roomsStore';

// import { getIsRoomsResortedFlag } from '../../vars/stores/cachedSortingOrderStore';


/**
 * Метод для изменения списка комнат не запрашивая новый список от сервера
 * @param {{}} data - Объект данных нужный для обработки соотв события, если не передан, запрос данных от сервера
 */
export async function updateRoomListWithData(data) {
    const roomsStore = useRoomsStore();
    let rooms = [];

    if (data) {
        if (data.is_room_details)
            rooms = updateRoomListWithNewDetails(data);
        else if (data.is_room_delete)
            rooms = updateRoomListWithDeletedRoomId(data);
        else if (data.is_message_update)
            rooms = updateRoomListWithMessage(data, false);
        else if (data.is_tag_rename)
            rooms = updateRoomListWithTag(data);
        else{
            // Если была создана комната только что и пришло системное сообщение в ней
            if (!roomsStore.rooms.some(item => item.id === data.room_id))
                return;

            rooms = updateRoomListWithMessage(data);
        }
    }

    else
        rooms = await loadRoomList(); // забираем с сервера актуальный счетчик, в списке комнат

    roomsStore.setRooms(rooms);
}

/**
 * @param {{ id, from:{id, username}, attachments, text, timestamp, room_id, is_read }} message - Объект данных нужный для обработки соотв события
 * @param {boolean} insertToTop - Необходимость пересортировки комнаты получившей сообщения наверх списка
 */

function updateRoomListWithMessage(message, insertToTop = true) {
    const roomsStore = useRoomsStore();
    const usersStore = useUsersStore();
    const rooms = roomsStore.rooms;
    const current_user = usersStore.getCurrentUser();

    const roomId = message.room_id;
    const isOutgoing = current_user.id === message.from?.id ?? false;
    const wasSheduled = isOutgoing && !message.is_read;

    // Найдём индекс комнаты в массиве
    const roomIndex = rooms.findIndex(item => item.id === roomId);

    // изменяем переменные при необходимости внутри списка комнат
    if (roomIndex !== -1) {
        let room = rooms[roomIndex];

        // Удаляем старую версию комнаты
        rooms.splice(roomIndex, 1);

        const isMessageUpdate = message.id === room.last_message.id || message.is_message_update;
        // определяем необходимость изменения (если сообщение новое)
        const shouldUpdate = isMessageUpdate || insertToTop;

        // Проверка необходимости изменения переменных последнего сообщения комнаты
        const updId = shouldUpdate ? message.id : room.last_message.id;
        const updFromId = shouldUpdate ? message.from?.id : room.last_message.from;
        const updIsAttachments = shouldUpdate ? message.attachments.length > 0 : room.last_message.is_attachments;
        const updUsername = shouldUpdate ? message.from?.username : room.last_message.username;
        const updText = shouldUpdate ? message.text : room.last_message.text;
        const updTimestamp = shouldUpdate ? message.timestamp : room.last_message.timestamp;
        const updDate = shouldUpdate ? formatRelativeTime(message.timestamp) : room.date;

        const updatedRoom = {
            ...room,
            unread_count: !isOutgoing || wasSheduled
                ? isMessageUpdate
                    ? room.unread_count
                    : room.unread_count + 1
                : 0,
            is_archived: room.is_archived && room.is_notifications ? false : room.is_archived,
            date: updDate,
            timestamp: updTimestamp,
            last_message: {
                ...room.last_message,
                id: updId,
                from: updFromId,
                is_attachments: updIsAttachments,
                username: updUsername,
                text: updText,
                timestamp: updTimestamp,
            },
        };

        // Вставка: в начало или на прежнее место
        if (insertToTop) {
            // const sortingOrderReversed = getIsRoomsResortedFlag();
            // if (sortingOrderReversed) {
            //     rooms.push(updatedRoom);
            // }
            // else {
                rooms.unshift(updatedRoom);
            // }
        } else {
            rooms.splice(roomIndex, 0, updatedRoom);
        }
    }
    
    return rooms;
}

/**
 * @param {{name, is_archived, is_notifications, tags}} details - Объект данных нужный для обработки соотв события
 */
function updateRoomListWithNewDetails(details) {
    const roomsStore = useRoomsStore();
    let rooms = roomsStore.rooms;

    const updatedRooms = rooms.map(room => {
        if (room.id === details.id) { // точка входа в изменение комнаты в нашем списке
            return {
                ...room,
                // change if req
                name: details.name ?? room.name,
                is_archived: details.is_archived ?? room.is_archived,
                is_notifications: details.is_notifications ?? room.is_notifications,
                tags: details.tags ?? room.tags,
            };
        }
        return room;
    });

    return updatedRooms;
}

/**
 * @param {{id}} data - Объект данных нужный для обработки соотв события
 */
function updateRoomListWithDeletedRoomId(data) {
    const roomsStore = useRoomsStore();
    let rooms = roomsStore.rooms;
    const deleted_id = data.id;

    const updatedRooms = rooms.filter(room => room.id !== deleted_id);

    return updatedRooms;
}

/**
 * @param {{old_name, name}} tag_data - Объект данных нужный для обработки соотв события
 */
function updateRoomListWithTag(tag_data) {
    const roomsStore = useRoomsStore();
    let rooms = roomsStore.rooms;

    const updatedRooms = rooms.map(room => {
        // Обновляем теги комнаты
        const updatedTags = room.tags?.map(tag => {
            if (tag.name === tag_data.old_name) {
                return {
                    ...tag,
                    name: tag_data.new_name // Присваиваем новое имя
                };
            }
            return tag;
        });

        // Возвращаем обновленную комнату с обновленными тегами
        return {
            ...room,
            tags: updatedTags
        };
    });
    
    return updatedRooms;
}
