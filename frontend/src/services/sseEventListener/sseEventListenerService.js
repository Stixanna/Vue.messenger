import { BASE_URL } from '@/config';

import { loadCurrentInfo } from '@/services/dataLoaders/loadCurrentInfo';
import { notifyIfRequired } from '@/globalUIMethods/notifyIfRequired';
import { startConnectionErrorNotify, stopConnectionErrorNotify } from '@/globalUIMethods/connectionErrorNotify';

// import { useRoomsStore } from '@/stores/roomsStore';
// import { useTagsStore } from '@/stores/tagsStore';

// import { addRoomTag, getTags, removeRoomTag, updateTagName } from '../vars/stores/tagsStore';
// import { getRoomById, getRooms } from '../vars/stores/roomsStore';
// import { datalistAddOption, datalistRemoveOption, datalistUpdateOption } from '@/global/datalistUpdateMethods';
// import { rerenderRoomList } from '../chat/renderers/rerenderRoomList';
// import { renderRoom } from '../chat/renderers/renderRoom';
// import { renderEditableInputRow } from '../sidebar/elements/renderEditableInputRow';
// import { addEditableInputButtonsListeners } from '../listeners/editableInputHandlers/addEditableInputButtonsListeners';
// import { updateRoomListWithData } from '../chat/renderers/updateRoomListWithData';

import { emit } from '@/services/uiEventBus';

import { processMessageEvent } from './handlers/messageHandlers';
import { processRoomEvent } from './handlers/roomHandlers';
import { processCallEvent } from './handlers/callHandlers';
import { processStatusEvent } from './handlers/statusHandlers';
import { processInviteEvent } from './handlers/inviteHandlers';

// import { getCurrentLanguage } from '../vars/stores/currentLanguageStore';


const TAG_NAME = 'Имя тега';
const LABELS = {
    tag_titles:{
        edit:'Редактировать',
        delete:'Удалить',
        accept:'Подтвердить',
    }
}

const CONNECTION_STATE = {
    CONNECTED: 'connected',
    NATIVE_RETRYING: 'native-retrying',
    MANUAL_RETRYING: 'manual-retrying',
};
let connectionState = CONNECTION_STATE.CONNECTED;

let reconnectDelay = 1000;           
const MAX_RECONNECT_DELAY = 8000;   
const EVENTSOURCE_GRACE_TIMEOUT = 10000; 

let reconnectTimer = null;

let eventSourceSSE = null;

/**
 * Метод запускающий слушатель SSE событий
 * @param {boolean} is_initial Если объявлен, то не вызывать refreshAllData() 
 */
export function sseEventListener( is_initial ) {
    setupSSE(is_initial);
}
/**
 * Метод проверяющий подключено ли SSE
 */
export function isSseConnected() {
    return connectionState === 'connected';
}
/**
 * Очистка SSE
 */
function cleanupSSE() {
    if (eventSourceSSE) {
        eventSourceSSE.close();
        eventSourceSSE = null;
    }
}

/**
 * Планирование реконнекта
 */
function scheduleReconnect() {
    cleanupSSE();

    console.warn(`🔁 Ручное SSE переподключение через ${reconnectDelay / 1000} сек`);

    setTimeout(() => {
        setupSSE();
        reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
    }, reconnectDelay);
}

/**
 * Создание SSE соединения
 * @param {boolean} is_initial Если объявлен, то не вызывать refreshAllData() 
 */
function setupSSE( is_initial ) {
    cleanupSSE();

    eventSourceSSE = new EventSource(`${BASE_URL}/stream/sse`, {
        withCredentials: true,
    });

    eventSourceSSE.onopen = async () => {
        console.log('✅ SSE соединение установлено');

        reconnectDelay = 1000;
        connectionState = CONNECTION_STATE.CONNECTED;

        stopConnectionErrorNotify('sse');

        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
        if(!is_initial)
            await refreshAllData();
    };

    eventSourceSSE.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            handleSSEData(data);
        } catch (e) {
            console.error('❌ Ошибка парсинга SSE данных', e);
        }
    };

    eventSourceSSE.onerror = (error) => {
        console.warn('⚠️ SSE соединение потеряно', error);

        if (connectionState === CONNECTION_STATE.CONNECTED) {
            connectionState = CONNECTION_STATE.NATIVE_RETRYING;

            startConnectionErrorNotify('sse');

            reconnectTimer = setTimeout(() => {
                if (connectionState === CONNECTION_STATE.NATIVE_RETRYING) {
                    connectionState = CONNECTION_STATE.MANUAL_RETRYING;
                    scheduleReconnect();
                }
            }, EVENTSOURCE_GRACE_TIMEOUT);

            return;
        }

        if (connectionState === CONNECTION_STATE.MANUAL_RETRYING) {
            scheduleReconnect();
        }
    };
}

/**
 * Метод для получения всех данных при восстановлении соединения с сервером
 */
async function refreshAllData() { 
    await loadCurrentInfo();
    
    // const roomsStore = useRoomsStore();
    // const selected_room = roomsStore.getSelectedRoom();  // Выбранная сейчас комната
    // if (selected_room) {
    //     // Передаем только значение не мутируя объект в getSelectedRoom()
    //     await renderRoom({
    //         ...selected_room,
    //         details: null,
    //         is_cached_input: true,
    //     });
    // }
}

/**
 * Метод для обработки пришедших ссе событий, вызов обработчиков
 * @param {{type, data:{id, }}} data - data содержит id и другие данные в зависимости от type
 */
async function handleSSEData(data) {
    console.log('📨 Пришло сообщение SSE:', data);  // debug
    // const roomsStore = useRoomsStore();
    // const selected_room = roomsStore.getSelectedRoom();  // Выбранная сейчас комната

    const notificatedEvents = ['message-min','invite','call'];
    if(notificatedEvents.includes(data.type)){
        // Оброботка сообщений снаружи
        if(data.type !== 'message-min')
            notifyIfRequired(data);
    }
    switch (data.type) { // Обрабатываем тип полученного события
        case 'message-min':
        case "delayed-message-min":
        case "message-update-min":
        case "message-delete-min":
            const message = await processMessageEvent({action: data.type, data: data.data});
            
            emit(data.type, message);

            break;
            
        case "invite": // Если приглашение то
            processInviteEvent({action: data.type, data: data.data});

            emit(data.type, data.data);

            break;

        case "room-create":
        case "roomupdate-min":
        case "room-delete":
        case "roomupdate_notifications":    // изменение статуса уведомлений комнаты
        case "roomupdate_archived":         // изменение статуса архивированности комнаты
            const updatedRoom = await processRoomEvent({action: data.type, data: data.data});
            
            emit(data.type, updatedRoom);

            break;

        case "call":
            const callData = processCallEvent({ action: data.type, data: data.data });

            emit(data.type, callData);

            break;
            
        case "room-tag-set":
        case "room-tag-unset":
        case "tag-update":
            // Не проверялось так как было перенесено в вебсокет еще на этапе разработки
            emit(data.type, data);

            break;
            // const tagData = data.data;
            // const old_name = tagData.old_name;
            // const tag_name = tagData.tag_name ?? tagData.name;
            // const tagged_room_id = tagData.room_id;

            // const columnRight = document.querySelector('#column-right');
            // if(data.type === 'room-tag-set'){
            //     const tag = { id: tagData.id, room_id: tagData.room_id, name: tag_name };
            //     addRoomTag(tagged_room_id, tag_name);

            //     const roomTagList = columnRight.querySelector('.column-container#tags');
            //     const is_selected_room_changed = selected_room.id === tagged_room_id;

            //     // Если сейчас открыт сайдбар редактирования тегов
            //     if(is_selected_room_changed && roomTagList){
            //         const tagWithValue = { ... tag, 
            //             value: tag.name, placeholder: TAG_NAME, key: 'column_tag',
            //             buttons:[
            //                 {type:'accept', title: LABELS.tag_titles.accept}, 
            //                 {type:'edit', title: LABELS.tag_titles.edit},
            //                 {type:'delete', title:LABELS.tag_titles.delete}] 
            //         };
            //         const tagEl = document.createElement('div');
            //         renderEditableInputRow(tagEl, tagWithValue);

            //         addEditableInputButtonsListeners(tagEl);

            //         // firstElementChild из за некорректного рендера списка строк, нужно пофиксить
            //         roomTagList.firstElementChild.appendChild(tagEl);
            //     }
            //     // const roomTagListOld = columnRight.querySelector('#tag-list');
            //     // if(roomTagListOld){
            //     //     const is_selected_room_changed = selected_room.id === tagged_room_id;

            //     //     // Если сейчас открыт сайдбар редактирования тегов
            //     //     if(is_selected_room_changed){
            //     //         const tagWithButton = { ... tag, del_btn: true };
            //     //         const tagEl = renderTagBadge(tagWithButton);

            //     //         const delButton = tagEl.querySelector('#deleteTag');
            //     //         delButton.addEventListener('click', async (event) => handleTagDeleteClick(event));

            //     //         roomTagListOld.appendChild(tagEl);
            //     //     }
            //     // }
            // }
            // else if (data.type === 'room-tag-unset'){
            //     // taggedRoom.tags = taggedRoom.tags.filter(item => item.name !== tag_name);
            //     removeRoomTag(tagged_room_id, tag_name);
            // }
            // else if (data.type === 'tag-update'){
            //     const old_tag_name = old_name;
            //     const updated_tag_name = tag_name;

            //     updateTagName(old_tag_name, updated_tag_name);
            // }
            // if(tagged_room_id){
            //     // Получение изменений в конкретной комнате
            //     const taggedRoom = getRoomById(tagged_room_id);

            //     // Ререндер тегов комнаты в списке комнат
            //     taggedRoom.is_room_details = true;  // identification
            //     await updateRoomListWithData(taggedRoom);
            //     rerenderRoomList();
            // }
            // else{
            //     // Ререндер всех комнат в которых есть данный тег
            //     tagData.is_tag_rename = true;
            //     await updateRoomListWithData(tagData);
            //     rerenderRoomList();
            // }
                
            // // Ререндер тегов в списке тегов правой колонки
            // const datalistTagList = columnRight.querySelector('#input_add_new_tag .autocomplete');
            // if(datalistTagList){
            //     const tags = getTags();
            //     const changedTag = tags.find(item => item.name === tag_name);
            //     if(data.type === 'room-tag-set'){
            //         if(changedTag && changedTag.count === 1){
            //             // Добавить только если только что добавили тег
            //             datalistAddOption(datalistTagList, tag_name);
            //         }
            //     }
            //     else if (data.type === 'room-tag-unset'){
            //         if(!changedTag){
            //             // Remove только если не нашли в списке тегов
            //             datalistRemoveOption(datalistTagList, tag_name)
            //         }
            //     }
            //     else if (data.type === 'tag-update'){
            //         if(changedTag){
            //             datalistUpdateOption(datalistTagList, old_name, tag_name);
            //         }
            //     }
            // }
            // break;
        
        case"user-status":
            const isChanged = await processStatusEvent({ action: data.type, data: data.data });

            // Предотвращение мигания UI, запуск только подтвержденных изменений
            if (isChanged) {
                emit(data.type, data.data);
            }

            break;

        case "reaction-set":
        case "reaction-unset":
        case "reaction-changed":
            // Отправляем данные на фронт без конвертации так как они достаточны
            emit(data.type, data);

            break;
            
        default:
            console.log('📨 Raw data.type:', data.type);
    }
}
