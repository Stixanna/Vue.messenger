import { ForwardMessage } from "@/services/messageService";

export function loadForwardMessage(
  fromRoomId: string,
  toRoomId: string,
  messageIds: string[],
): Promise<null> {
  return ForwardMessage(fromRoomId, toRoomId, messageIds);
}
