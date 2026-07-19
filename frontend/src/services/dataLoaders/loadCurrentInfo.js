import { FetchCurrentUser } from "@/services/userService";
import { loadInvites } from "@/services/dataLoaders/loadInvites";
import { loadUsers } from "@/services/dataLoaders/loadUsers";
import { loadRoomList } from "@/services/dataLoaders/loadRoomList";
import { useUsersStore } from '@/stores/usersStore';
import { useInvitesStore } from '@/stores/invitesStore';

// import { initializeRoomList } from "../../chat/initializeRoomList";


/**
 * Метод загрузки информации при инициализации
 * @param {boolean} get_currentuser - Получать ли данные о текущем пользователе
 * @param {boolean} get_rooms - Получать ли данные о комнатах
 * @param {boolean} get_invites - Получать ли данные о приглашениях
 * @param {boolean} get_users - Получать ли список всех пользователей
 */
export async function loadCurrentInfo( get_currentuser = true, get_rooms = true, get_invites = true, get_users = true ) {
    // получаем список rooms, tags, keywords
    if (get_rooms){
        await loadRoomList();
    }
    // получаем инвайты
    if (get_invites) {
        const invitesStore = useInvitesStore();

        const invites = await loadInvites();
        invitesStore.setInvites(invites);
    }
    // получаем список всех пользователей
    if (get_users) {
        await loadUsers();
    }
    // получим информацию об авторизованном пользователе
    if (get_currentuser) {
        const currentUser = await FetchCurrentUser();

        const curr_user_id = currentUser.id;

        const usersStore = useUsersStore();
        usersStore.markCurrentUser(curr_user_id);
    }
}
