import { ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  Invite,
  SendedInvite,
} from '@/types/invites';


export const useInvitesStore = defineStore('invites', () => {
  const invites = ref<Invite[]>([]);

  function setInvites(value: Invite[]): void {
    invites.value = value;
  }

  function addInvite(invite: Invite): void {
    invites.value.push(invite);
  }

  function removeInvite(inviteId: string): void {
    invites.value = invites.value.filter(
      invite => invite.id !== inviteId,
    );
  }

  function getInvitesCount(): number {
    return invites.value.length;
  }

  return {
    invites,
    setInvites,
    addInvite,
    removeInvite,
    getInvitesCount,
  };
});