import { computed, ref } from 'vue';
import { defineStore } from 'pinia';


export const useMessagesStateStore = defineStore(
  'messagesState',
  () => {
    const state = ref({
      read: {
        loaded: false,
        offset: 0,
      },

      unread: {
        loaded: false,
        offset: 0,
      },
    });


    const isReadLoaded = computed(
      () => state.value.read.loaded,
    );

    const isUnreadLoaded = computed(
      () => state.value.unread.loaded,
    );


    function setOffset(
      type: 'read' | 'unread',
      value: number,
    ): void {
      state.value[type].offset = value;
    }

    function setLoaded(
      type: 'read' | 'unread',
      value: boolean,
    ): void {
      state.value[type].loaded = value;
    }

    function reset(): void {
      state.value = {
        read: {
          loaded: false,
          offset: 0,
        },

        unread: {
          loaded: false,
          offset: 0,
        },
      };
    }


    return {
      state,

      isReadLoaded,
      isUnreadLoaded,

      setOffset,
      setLoaded,

      reset,
    };
  },
);