import { FetchUsers } from '@/services/userService';
import { useUsersStore } from '@/stores/usersStore';
import type { 
  User 
} from "@/types/users";

/**
 * Загружает список пользователей и обновляет существующие данные.
 *
 * @returns Актуальный список пользователей.
 */
export async function loadUsers()
: Promise<User[]> {
  const usersStore = useUsersStore();
  const users = usersStore.users;

  const responseData = await FetchUsers();

  const usersMap = new Map(
    users.map(user => [user.id, user]),
  );

  responseData.forEach(newUser => {
    const existingUser = usersMap.get(newUser.id);

    if (existingUser) {
      Object.assign(existingUser, newUser);
      existingUser.roomRights ??= new Map();
      return;
    }

    users.push({
      ...newUser,
      roomRights: new Map(),
    });
  });

  usersStore.setUsers(users);

  return users;
}