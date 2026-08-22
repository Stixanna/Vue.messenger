import { computed } from 'vue';
import { useDraftMessageStore } from '@/stores/draftMessageStore';
import { useRoomsStore } from '@/stores/roomsStore';

export function useChatDraft() {
  const draftStore = useDraftMessageStore();
  const roomsStore = useRoomsStore();

  const message = computed({
    get: () => draftStore.text,

    set: (value: string) => {
      draftStore.setText(value);
    },
  });

  const hasMessage = computed(() => {
    return message.value.trim().length > 0;
  });

  const embedMessage = computed(() => {
    return draftStore.embedMessage;
  });

  const showScheduledButton = computed(() => {
    const room = roomsStore.selectedRoom;

    return Boolean(
      room &&
      room.delayed_messages > 0 &&
      !hasMessage.value &&
      draftStore.attachments.length === 0,
    );
  });

  return {
    message,
    embedMessage,
    hasMessage,
    showScheduledButton,
  };
}