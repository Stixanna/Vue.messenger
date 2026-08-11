import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export interface EmbedMessage {
  embed_type: 'reply' | 'forward' | 'edit';
  id: string;
  text?: string;
  embed_room_id?: string;
}

export interface DraftMessage {
  text: string;
  attachments: File[];
  embedMessage: EmbedMessage | null;
  cachedMessage: {
    text: string;
    embedMessageObject: EmbedMessage | null;
  } | null;
}

export const useDraftMessageStore = defineStore('draftMessage', () => {
  const text = ref('');
  const attachments = ref<File[]>([]);
  const embedMessage = ref<EmbedMessage | null>(null);

  const cachedMessage = ref<DraftMessage['cachedMessage']>(null);

  const hasText = computed(() => text.value.trim().length > 0);
  const hasAttachments = computed(() => attachments.value.length > 0);

  function setText(value: string): void {
    text.value = value;
  }

  function clearText(): void {
    text.value = '';
  }

  function setEmbedMessage(value: EmbedMessage | null = null): void {
    embedMessage.value = value;
  }

  function setCachedMessage(): void {
    cachedMessage.value = {
      text: text.value,
      embedMessageObject: embedMessage.value,
    };
  }

  function clear(): void {
    text.value = '';
    attachments.value = [];
    embedMessage.value = null;
  }

  return {
    text,
    attachments,
    embedMessage,
    cachedMessage,

    hasText,
    hasAttachments,

    setText,
    clearText,
    setEmbedMessage,
    setCachedMessage,
    clear,
  };
});