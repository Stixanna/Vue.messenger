import { useUsersStore } from '@/stores/usersStore';
import { FetchUsers } from '@/services/userService';


/** Метод для получения списка всех пользователей с последующим setUsers */
export async function loadUsers() {
  const usersStore = useUsersStore();
  const users = usersStore.users;

  try {
    const responseData = await FetchUsers();

    const updUsers = responseData;

    // Быстрый поиск новых пользователей по id
    const usersMap = new Map(
      users.map(user => [user.id, user])
    );

    updUsers.forEach(newUser => {
      const existingUser = usersMap.get(newUser.id);

      if (existingUser) {
        // Проверка что данные пользователей не изменились
        Object.entries(newUser).forEach(([key, value]) => {
          if (existingUser[key] !== value) {
            existingUser[key] = value;
          }
        });

        existingUser.roomRights ??= new Map();
      }
      else {
        // Если пользователь зарегистрировался и в кеше его нет
        users.push({
          ...newUser,
          roomRights: new Map(),
        });
      }
    });

    usersStore.setUsers(users);
  }
  catch (error) {
    console.error('Error while trying to load users:', error);
  }

  return users;
}
