import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  User,
  RoomRightsPayload,
  RoomRights,
} from '@/types/users';


export const useUsersStore = defineStore('users', () => {
  /**
   * State
   */
  const users = ref<User[]>([]);

  /**
   * Getters
   */
  const sortedUsers = computed(() => {
    return [...users.value].sort((a, b) => {
      // Онлайн выше офлайна
      if (a.status.is_online !== b.status.is_online) {
        return a.status.is_online ? -1 : 1;
      }

      // Затем по имени
      return a.full_name.localeCompare(
        b.full_name,
        'ru',
        { sensitivity: 'base' },
      );
    });
  });

  const currentUser = computed(getCurrentUser);

  /**
   * Actions
   */
  function setUsers(value: User[]): void {
    users.value = value.map(user => ({
      ...user,
      roomRights: user.roomRights ?? new Map(),
    }));
  }

  function markCurrentUser(userId: string): void {
    users.value = users.value.map(user => ({
        ...user,
        current: user.id === userId,
    }));
  }

  function getCurrentUser(): User {
    const user = users.value.find(user => user.current);

    if (!user) {
      throw new Error('Current user was not found.');
    }

    return user;
  }

  function getUserById(
    userId: string,
  ): User | undefined {
    return users.value.find(
      user => user.id === userId,
    );
  }

  function updateUser(
    userData: Pick<User, 'id' | 'status'>,
  ): void {
    const user = getUserById(userData.id);

    if (!user) {
      console.error(
        `User ${userData.id} not found`,
      );
      return;
    }

    user.status = userData.status;
  }

  function updateUserRoomRights(
    userId: string,
    roomId: string,
    rights: Partial<RoomRights>,
  ): void {
    const user = getUserById(userId);

    if (!user) {
      console.error(
        `User ${userId} not found`,
      );
      return;
    }

    const currentRights =
      user.roomRights.get(roomId) ?? {};

    user.roomRights.set(roomId, {
      ...currentRights,
      ...rights,
    } as RoomRights);
  }

  function clear(): void {
    users.value = [];
  }

  return {
    users,

    sortedUsers,
    currentUser,

    // getCurrentUser,
    setUsers,
    markCurrentUser,
    getUserById,
    updateUser,
    updateUserRoomRights,
    clear,
  };
});

/**
 * Преобразование payload пользователя
 * в объект прав комнаты
 */
export function parsePayloadRoomRights(
  payload: RoomRightsPayload,
): RoomRights {
  return {
    is_invite_accepted: payload.is_invite_accepted,
    is_creator: payload.is_creator,
    is_modder: payload.is_modder,
    can_write: payload.can_write,
    can_invite: payload.can_invite,
  };
}