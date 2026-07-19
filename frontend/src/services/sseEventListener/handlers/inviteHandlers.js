import { useInvitesStore } from '@/stores/invitesStore';


const actionHandlers = {
    'invite': handleInvite,
};

/**
 * Метод для обработки события приглашения,
 *
 * Выполняет только обновление данных и состояния
 * приложения под капотом, не изменяя UI напрямую.
 *
 * @param {{
 *     action: string,
 *     data: inviteEvent
 * }} payload - Сырые данные для обработки.
 */
export function processInviteEvent(payload) {
    const { action, data } = payload;

    const actionHandler =
        actionHandlers[action];

    if (!actionHandler) {
        console.warn(
            'Unknown action:',
            payload.action
        );

        return;
    }

    actionHandler(data);
}

/**
 * @typedef {Object} inviteEvent
 * @property {string} from
 * @property {string} room_id
 */

/**
 * @param {inviteEvent} payloadData Данные о пришедшем приглашении
 */
function handleInvite(payloadData) {
    const invitesStore = useInvitesStore();

    invitesStore.addInvite({payloadData});   
}

