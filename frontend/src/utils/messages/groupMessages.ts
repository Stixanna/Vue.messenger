import { formatDate } from '@/utils/formatDate';
import type { Message } from '@/types/messages';

interface DateGroup {
  date: string;
  readableDate: string;
  messages: Message[];
  groups: PeerGroup[];
}

interface PeerGroup {
  peerId: string | undefined;
  messages: Message[];
  lastTimestamp: number;
}

export function groupMessages(
  messages: Message[] | undefined,
  thresholdMinutes: number,
): DateGroup[] {
  const dateGroups: Record<string, DateGroup> = {};

  messages?.forEach((message) => {
    const date = getISODate(message.timestamp);

    if (!dateGroups[date]) {
      dateGroups[date] = {
        date,
        readableDate: formatDate(message.timestamp),
        messages: [],
        groups: [],
      };
    }

    dateGroups[date].messages.push(message);
  });

  return Object.values(dateGroups)
    .map((dateGroup) => ({
      ...dateGroup,
      groups: groupByPeer(
        dateGroup.messages.reverse(),
        thresholdMinutes,
      ),
    }))
    .reverse();
}

function groupByPeer(
  messages: Message[],
  thresholdMinutes: number,
): PeerGroup[] {
  const groups: PeerGroup[] = [];

  let currentGroup: PeerGroup | undefined;

  messages.forEach((message) => {
    const timestamp = new Date(message.timestamp).getTime();
    const peerId = message.from?.id;

    if (
      !currentGroup ||
      currentGroup.peerId !== peerId ||
      isTooOld(
        timestamp,
        currentGroup.lastTimestamp,
        thresholdMinutes,
      ) ||
      peerId === 'systemid'
    ) {
      currentGroup = {
        peerId,
        messages: [],
        lastTimestamp: timestamp,
      };

      groups.push(currentGroup);
    }

    currentGroup.messages.push(message);
    currentGroup.lastTimestamp = timestamp;
  });

  return groups;
}

function isTooOld(
  current: number,
  previous: number,
  thresholdMinutes: number,
): boolean {
  const diff = Math.abs(current - previous) / (1000 * 60);

  return diff > thresholdMinutes;
}

function getISODate(timestamp: string): string {
  const date = new Date(timestamp);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}