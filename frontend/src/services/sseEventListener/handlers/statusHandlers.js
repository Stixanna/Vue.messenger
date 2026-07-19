import { useUsersStore } from '@/stores/usersStore';


const actionHandlers = {
    'user-status': handleUserStatus,
};

const appliedUserStatuses = new Map();
const userStatusTimers = new Map();
const userLastStatusEvent = new Map();

const USER_STATUS_DELAY = 1000; 

/**
 * Метод для обработки события статуса,
 * предотвращая мигание ui при ф5.
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 *
 * @param {{
 *     action: string,
 *     data: statusEvent
 * }} payload - Сырые данные для обработки.
 *
 * @returns {Promise<boolean>} Нормализованные данные события.
 */
export async function processStatusEvent(payload) {
    const { action, data } = payload;

    const actionHandler =
        actionHandlers[action];

    if (!actionHandler) {
        console.warn(
            'Unknown status action:',
            payload.action
        );

        return eventedRoom;
    }

    const callData = await actionHandler(data);

    return callData;
}

/**
 * @typedef {Object} statusEvent
 * @property {string} id
 * @property {Object} status
 * @property {Object} status.is_online
 * @property {Object} status.timestamp
 */

/**
 * @param {statusEvent} payloadData Данные о пользователе обновившем статус
 */
function handleUserStatus(payloadData) {

    const updatingUser = payloadData;
    const userId = updatingUser.id;

    const incomingTs = new Date(
        updatingUser.status.timestamp
    ).getTime();

    // сохраняем последнее входящее событие
    userLastStatusEvent.set(userId, {
        user: updatingUser,
        timestamp: incomingTs
    });

    // таймер уже существует -> просто обновили последнее событие
    if (userStatusTimers.has(userId)) {
        return Promise.resolve(false);
    }

    return new Promise((resolve) => {
        const timerId = setTimeout(() => {
            const lastEvent = userLastStatusEvent.get(userId);

            userStatusTimers.delete(userId);

            if (!lastEvent) {
                resolve(false);
                return;
            }

            const appliedTimestamp =
                appliedUserStatuses.get(userId);

            // уже применяли это состояние
            if (
                appliedTimestamp &&
                appliedTimestamp >= lastEvent.timestamp
            ) {
                resolve(false);
                return;
            }
            const usersStore = useRoomsStore();

            const statusedUser = usersStore.getUserById(userId);

            const currentStatus =
                statusedUser?.status?.is_online;

            const nextStatus =
                lastEvent.user.status?.is_online;

            // состояние фактически не изменилось
            if (currentStatus === nextStatus) {
                appliedUserStatuses.set(
                    userId,
                    lastEvent.timestamp
                );

                resolve(false);
                return;
            }

            usersStore.updateUser(lastEvent.user);

            appliedUserStatuses.set(
                userId,
                lastEvent.timestamp
            );

            resolve(true);

        }, USER_STATUS_DELAY);

        userStatusTimers.set(userId, timerId);
    });
}

