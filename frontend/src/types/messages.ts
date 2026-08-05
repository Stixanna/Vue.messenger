import type { 
  User 
} from "./users";


export interface Attachment  {
  id: string,
  name: string,
  type: string,
  view: string | null,
  edit: string | null,
  size: number,
  height: number | null,
  width: number | null,
  message_id: string,
}

export interface Message  {
  id: string,
  from: User | null;
  text: string, 
  in_reply_to: string | null,
  attachments: Attachment[]
  timestamp: string,
  updated_at: string,
  is_edited: boolean | undefined,
  is_read: boolean | undefined,
}
