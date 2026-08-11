import { computed } from 'vue';
import { useDraftMessageStore } from '@/stores/draftMessageStore';
import { useRoomsStore } from '@/stores/roomsStore';
import { loadSendMessage } from '@/services/dataLoaders/loadSendMessage';
import { loadForwardMessage } from '@/services/dataLoaders/loadForwardMessage';
import { loadEditMessage } from '@/services/dataLoaders/loadEditMessage';

export function useSendMessage() {
  const draftStore = useDraftMessageStore();
  const roomsStore = useRoomsStore();

  const canSend = computed(() => {
    const hasText = draftStore.text.trim().length > 0;
    const hasAttachments = draftStore.attachments.length > 0;
    const embed = draftStore.embedMessage;

    if (hasText || hasAttachments) {
      return true;
    }

    if (!embed) {
      return false;
    }

    return (
      embed.embed_type === 'forward' ||
      embed.embed_type === 'edit'
    );
  });

  async function sendMessage(): Promise<void> {
    if (!canSend.value) {
      return;
    }

    const text = draftStore.text.trim();
    const embed = draftStore.embedMessage;

    if (!embed) {
      await loadSendMessage(text);

      draftStore.clear();

      return;
    }

    switch (embed.embed_type) {
      case 'reply':
        await sendReply(text, embed);
        break;

      case 'forward':
        await sendForward(text, embed);
        break;

      case 'edit':
        await sendEdit(text, embed);
        break;
    }
  }

  async function sendReply(
    text: string,
    embed: NonNullable<typeof draftStore.embedMessage>,
  ): Promise<void> {
    await loadSendMessage(text, embed);
    draftStore.clear();
  }

  async function sendForward(
    text: string,
    embed: NonNullable<typeof draftStore.embedMessage>,
  ): Promise<void> {
    if (!embed.embed_room_id) {
      return;
    }

    await loadForwardMessage(
      embed.embed_room_id,
      roomsStore.selectedRoom?.id || '',    // temp
      [embed.id],
    );

    if (text || draftStore.attachments.length > 0) {
      await loadSendMessage(text);
    }

    draftStore.clear();
  }

  async function sendEdit(
    text: string,
    embed: NonNullable<typeof draftStore.embedMessage>,
  ): Promise<void> {
    const previousText = embed.text ?? '';

    if (text !== previousText) {
      await loadEditMessage(embed.id, text);
    }

    draftStore.clear();
  }

  return {
    canSend,
    sendMessage,
  };
}