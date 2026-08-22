<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { useDraftMessageStore } from '@/stores/draftMessageStore';
import { useChatDraft } from '@/composables/useChatDraft';
import { useSendMessage } from '@/composables/useSendMessage';
import ScheduledMessagesButton from './ScheduledMessagesButton.vue';
import AttachmentAddButton from './AttachmentAddButton.vue';
import SendButton from './SendButton.vue';
import EmbedMessage from '../messages/EmbedMessage.vue';

const { 
  message, 
  showScheduledButton,
  embedMessage, 
} = useChatDraft();
const draftMessageStore = useDraftMessageStore();

const { canSend, sendMessage } = useSendMessage();

const textarea = ref<HTMLTextAreaElement | null>(null);

const MIN_HEIGHT = 56;
const MAX_HEIGHT = 200;
const EXPAND_AFTER_ROWS = 4;

function resizeTextarea(): void {
	const element = textarea.value;

	if (!element) {
		return;
	}

	const lineHeight = parseFloat(
		getComputedStyle(element).lineHeight,
	);

	element.style.maxHeight = `${MIN_HEIGHT}px`;
	element.style.height = 'auto';

	const scrollHeight = element.scrollHeight;
	const visibleRows = Math.round(scrollHeight / lineHeight);
	const shouldExpand = visibleRows > EXPAND_AFTER_ROWS;

	element.style.maxHeight = shouldExpand
		? `${MAX_HEIGHT}px`
		: `${MIN_HEIGHT}px`;

	element.style.height = `${Math.min(scrollHeight, MAX_HEIGHT)}px`;
	element.style.overflowY = scrollHeight > MAX_HEIGHT
		? 'auto'
		: 'hidden';
}

async function handleInput(): Promise<void> {
	await nextTick();
	resizeTextarea();
}

function handleKeydown(event: KeyboardEvent): void {
	if (event.key !== 'Enter' || event.shiftKey) {
		return;
	}

	event.preventDefault();

	void sendMessage();
}

async function handleEmbedCancel() {
  if(embedMessage.value!.embed_type === 'edit'){
    const prevText = draftMessageStore.cachedMessage?.text;
    draftMessageStore.setText(prevText ?? '');
  }
  draftMessageStore.setEmbedMessage(null);
}
</script>

<template>
<div
  id="chat-input"
  class="chat-input"
>
  <div class="chat-footer-wrapper">
    <div
      id="input-wrapper"
      class="textarea-wrapper"
    >
      <EmbedMessage 
        v-if="embedMessage"
        :message="embedMessage"
        :embed-type="embedMessage.embed_type"
        @cancel="handleEmbedCancel"
      />
      
      <div
        id="chat-input-buttons"
        class="chat-input-buttons"
      >
        <ScheduledMessagesButton
          v-if="showScheduledButton"
        />

        <AttachmentAddButton />
      </div>

      <textarea
        ref="textarea"
        id="message-input"
        v-model="message"
        spellcheck="false"
        autocomplete="off"
        maxlength="1000"
        placeholder="Write a message..."
        data-scroll-element="true"
        @input="handleInput"
        @keydown="handleKeydown"
      ></textarea>
    </div>

    <SendButton
      :disabled="!canSend"
      @click="sendMessage"
    />
  </div>
</div>
</template>

<style scoped>

</style>