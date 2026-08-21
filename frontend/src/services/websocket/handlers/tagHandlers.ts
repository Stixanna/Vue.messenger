import { normalizeDataPayload } from "@/services/websocket/normalizeDataPayload";
import { updateRoomListWithData } from "@/utils/updateRoomListWithData";

import { useRoomsStore } from "@/stores/roomsStore";
import { useTagsStore } from "@/stores/tagsStore";

interface TagSetEventData {
  room_id: string;
  tag_id: string;
  tag_name: string;
  order_num: number;
}

interface TagUnsetEventData {
  room_id: string;
  tag_id: string;
  tag_name: string;
}

interface TagRenameEventData {
  room_id: string;
  tag_id: string;
  old_name: string;
  new_name: string;
}

interface TagDeleteEventData {
  room_id: string;
  tag_id: string;
  tag_name: string;
}

interface TagOrderEventData {
  room_id: string;
  tag_id: string;
  tag_name: string;
  normilized: string;
  order_num: number;
}

interface WebSocketTagEvent {
  action: string;
  data: Record<string, unknown>;
}

/**
 * Маршрутизирует события тегов по типу действия.
 *
 * Входной payload соответствует общему формату
 * WebSocket-события. После проверки action событие
 * сужается до конкретного TagEvent.
 */
export function routeTagEvent(
    payload: WebSocketTagEvent,
): Record<string, unknown> {
  const normalizedData = normalizeDataPayload(
      payload.data,
  );

  switch (payload.action) {
    case "set":
      handleTagSet(normalizedData);
      break;

    case "unset":
      handleTagUnset(normalizedData);
      break;

    case "rename":
      handleTagRename(normalizedData);
      break;

    case "delete":
      handleTagDelete(normalizedData);
      break;

    case "order":
      handleTagOrder(normalizedData);
      break;

    default:
    console.warn(
      "Unknown tag action:",
      payload.action,
    );
  }

  return normalizedData;
}

function handleTagSet(data: TagSetEventData): void {
  const {
      order_num,
      room_id,
      tag_id,
      tag_name,
  } = data;

  const tagsStore = useTagsStore();

  const tagToSet = {
      order_num,
      tag_id,
      tag_name,
  };

  tagsStore.addRoomTag(room_id, tagToSet);

  console.log("Backend tag set:", data);
}

function handleTagUnset(data: TagUnsetEventData): void {
  const {
      room_id,
      tag_id,
      tag_name,
  } = data;

  const tagsStore = useTagsStore();

  tagsStore.removeRoomTag(room_id, {
      tag_id,
      tag_name,
  });

  console.log("Backend tag unset:", data);
}

function handleTagRename(data: TagRenameEventData): void {
  const tagsStore = useTagsStore();

  tagsStore.updateTagName(data);

  updateRoomListWithData({
      ...data,
      type: "tag_rename",
  });

  console.log("Backend tag renamed:", data);
}

function handleTagDelete(data: TagDeleteEventData): void {
  console.log("Backend tag deleted:", data);
}

function handleTagOrder(data: TagOrderEventData): void {
  const {
    room_id,
    tag_id,
    order_num,
  } = data;

  const roomsStore = useRoomsStore();
  
  const room = roomsStore.getRoomById(room_id);

  if (!room) {
    return;
  }

  const roomTags = [...room.tags];

  const tag = roomTags.find(
    item => item.tag_id === tag_id,
  );

  if (tag) {
    tag.order = order_num;
  }

  const tagsResorted = roomTags.sort(
    (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity),
  );

  roomsStore.updateRoomTags(
    room.id,
    tagsResorted,
  );

  console.log("Backend tag ordered:", data);
}