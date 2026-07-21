import { loadCurrentInfo } from "@/services/dataLoaders/loadCurrentInfo";
import { initWebSocket } from "@/services/websocket/websocketService";
import { sseEventListener } from "@/services/sseEventListener/sseEventListenerService";

// import { openSidebar } from "../sidebar/openSidebar";
// import { menuToggleButton } from "../vars/globalElements";
// import { createBadge } from "../global/createBadge";
// import { renderRoom } from '../chat/renderers/renderRoom';

// import { getInvitesCount } from "../vars/stores/countInvitesStore";
// import { getCachedRoomId } from "../vars/stores/cachedSelectedrRoomIdStore";
// import { getRoomById } from "../vars/stores/roomsStore";


/**
 * Метод для рендера авторизованной главной страницы
 */
export async function initializeChat() {
    // Получаем всю актуальную информацию
    try {
        await loadCurrentInfo();
    } catch (error) {
        console.error('Error while receiving current data:', error)
    }

    // Запускаем слушатели событий
    sseEventListener(true);
    initWebSocket(true);

    // // Рендерим последнюю открытую на девайсе комнату
    // renderCachedRoom();

    // // отображаем прогруженные инвайты
    // const invites_count = getInvitesCount();
    // if( invites_count > 0){
    //     menuToggleButton.appendChild(createBadge( invites_count ));
    // }
}
// /**
//  * Метод для рендера последней открытой на девайсе комнаты
//  */
// function renderCachedRoom(){
//     // не рендерим последнюю комнату при рестарте, если ширина мобильная
//     if (!window.matchMedia("(max-width: 600px)").matches){
//         const cached_room_id = getCachedRoomId();
//         if(cached_room_id){
//             const cachedActiveRoom = getRoomById(cached_room_id);

//             if(cachedActiveRoom){
//                 if(cachedActiveRoom.is_archived)
//                     openSidebar('archived_chats');

//                 renderRoom(cachedActiveRoom);
//             }
//         }
//     }
// }
