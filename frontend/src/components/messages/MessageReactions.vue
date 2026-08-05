<script setup>
import { computed } from 'vue';
import { useUsersStore } from '@/stores/usersStore';
import Reaction from './Reaction.vue';


const props = defineProps({
  reactions: {
    type: Array,
    default: () => [],
  },

  messageId: {
    type: [String, Number],
    required: true,
  },
});

const usersStore = useUsersStore();

function toggleReaction(reaction) {
  if (reaction.user_id !== usersStore.currentUser?.id) {
    return;
  }
  console.log('click_reaction2');

  // loadToggleReaction(
  //   props.reaction.message_id,
  //   props.reaction.symbol,
  // );
}

const preparedReactions = computed(() => {
  return props.reactions.map((reaction) => ({
    ...reaction,
    message_id: props.messageId,
  }));
});
</script>

<template>
<div
  v-if="preparedReactions.length"
  class="message-reactions">

  <Reaction
    v-for="reaction in preparedReactions"
    @click="toggleReaction(reaction)"
    :key="`${reaction.emoji}-${reaction.user_id}`"
    :reaction="reaction" />

</div>
</template>

<style scoped>
.message.with-reactions .message-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-block: .5rem;
}
</style>
