import { FetchInvites } from '@/services/roomService';

import type {
  Invite,
} from '@/types/invites';


export async function loadInvites()
  : Promise<Invite[]> {
  const responseData = await FetchInvites();

  const invites = Object.entries(responseData).map(([_, invite]) => ({
    id: invite.id,
    name: invite.name,
  }));

  return invites;
}
