import { FetchCurrentUser } from '@/services/userService';
import { loadInvites } from '@/services/dataLoaders/loadInvites';
import { loadUsers } from '@/services/dataLoaders/loadUsers';
import { loadRoomList } from '@/services/dataLoaders/loadRoomList';
import { useUsersStore } from '@/stores/usersStore';
import { useInvitesStore } from '@/stores/invitesStore';

/**
 * Загружает данные, необходимые при инициализации приложения.
 *
 * @param getCurrentUser - Получать ли данные текущего пользователя.
 * @param getRooms - Получать ли список комнат.
 * @param getInvites - Получать ли список приглашений.
 * @param getUsers - Получать ли список пользователей.
 */
export async function loadCurrentInfo(
  getCurrentUser = true,
  getRooms = true,
  getInvites = true,
  getUsers = true,
): Promise<void> {
  if (getUsers) {
    await loadUsers();
  }

  if (getCurrentUser) {
    const currentUser = await FetchCurrentUser();

    const usersStore = useUsersStore();
    usersStore.markCurrentUser(currentUser.id);
  }

  if (getRooms) {
    await loadRoomList();
  }

  if (getInvites) {
    const invitesStore = useInvitesStore();

    const invites = await loadInvites();
    invitesStore.setInvites(invites);
  }
}