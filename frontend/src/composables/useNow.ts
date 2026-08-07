import { ref } from 'vue';

const now = ref(Date.now());

setInterval(() => {
  now.value = Date.now();
}, 60_000);

export function useNow() {
  return now;
}