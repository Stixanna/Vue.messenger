import { formatDate } from "@/utils/formatDate";


export function groupMessages(messages, thresholdMinutes) {
  const dateGroups = {};

  messages?.forEach((message) => {
    const date = getISODate(message.timestamp);

    if (!dateGroups[date]) {
      dateGroups[date] = {
        date,
        readableDate: formatDate(message.timestamp),
        messages: [],
      };
    }

    dateGroups[date].messages.push(message);
  });

  return Object.values(dateGroups)
    .map((dateGroup) => ({
      ...dateGroup,
      groups: groupByPeer(
        dateGroup.messages,
        thresholdMinutes,
      ),
    }))
    .reverse();
}


function groupByPeer(messages, thresholdMinutes) {
  const groups = [];

  let currentGroup = null;

  messages.forEach((message) => {
    const timestamp = new Date(
      message.timestamp,
    ).getTime();


    const needNewGroup =
      !currentGroup ||
      currentGroup.peerId !== message.peer_id ||
      isTooOld(
        timestamp,
        currentGroup.lastTimestamp,
        thresholdMinutes,
      ) ||
      message.peer_id === 'systemid';


    if (needNewGroup) {
      currentGroup = {
        peerId: message.peer_id,
        messages: [],
        lastTimestamp: timestamp,
      };

      groups.push(currentGroup);
    }


    currentGroup.messages.push(message);
    currentGroup.lastTimestamp = timestamp;
  });


  return groups.reverse();
}


function isTooOld(
  current,
  previous,
  thresholdMinutes,
) {
  const diff =
    Math.abs(current - previous)
    /
    (1000 * 60);

  return diff > thresholdMinutes;
}


function getISODate(timestamp) {
  const d = new Date(timestamp);

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1,
  ).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}