import { FetchInvites } from '@/services/roomService';


// Метод для получения приглашений
export async function loadInvites() {
    let invites = [];

    try {
        const responseData = await FetchInvites();

        invites = Object.entries(responseData).map(([_, invite]) => ({
            id: invite.id,
            name: invite.name,
        }));

    } 
    catch (error) {
        console.error('Error while trying to receive invitations:', error);
    }

    return invites;
}
