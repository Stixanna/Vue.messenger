import type {
  User,
} from '@/types/users';
import type { 
  Attachment,
  Message,
} from './messages';
import type { 
  RoomTag, 
} from './tag';
import type { 
  RoomKeyword, 
} from './keyword';

/**
 * Последнее сообщение комнаты
 */
export interface LastMessage {
  id: string;
  from: string;
  is_attachments: boolean;
  text: string;
  timestamp: string;
  username: string;
}

export interface RoomDetails {
  id: string;
  name: string;
  is_public: boolean;
  is_files_allowed: boolean;
  created_at: string;
  users: User[];
  tags: RoomTag[];
  keywords: RoomKeyword[];
}

export interface RoomAttachments {
  img: Attachment[];
  notimg: Attachment[];
}

/**
 * Комната
 */
export interface Room {
  id: string;
  name: string;
  created_at: string;
  delayed_messages: number;
  unread_count: number;
  is_archived: boolean;
  is_notifications: boolean;
  last_message: LastMessage;
  tags: RoomTag[];
  keywords: RoomKeyword[];

  selected: boolean;
  details?: RoomDetails;
  messages?: Message[];
  attachments?: RoomAttachments;
}