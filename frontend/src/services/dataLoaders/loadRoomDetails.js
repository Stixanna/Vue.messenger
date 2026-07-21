import { FetchRoomDetails } from '@/services/roomService';


// Метод фетча деталей комнаты

export async function loadRoomDetails(room_id) {
    let room_details;
    
    try {
        const responseData = await FetchRoomDetails(room_id);

        room_details = responseData;

    } catch (error) {
        // Ошибки сети или JSON-парсинга
        console.error('Error loading room information:', error);
    }


    return room_details;
}

