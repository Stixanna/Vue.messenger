import type { 
  User 
} from "./users";


export interface Message  {
  id: string,
  from: User | null;
  text: string, 
  in_reply_to: string | null,
  attachments: [
    {
      id: string,
      name: string,
      type: string,
      view: string | null,
      edit: string | null,
    },
  ]
  timestamp: string,
  updated_at: string,
  is_edited: boolean | undefined,
  is_read: boolean | undefined,
}
