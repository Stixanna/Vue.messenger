import { EditMessage } from "@/services/messageService";

export async function loadEditMessage( 
  messageId: string,
  messageNewText: string,
) : Promise<null> {
    const response = await EditMessage(messageId, messageNewText);
    return response;
}
