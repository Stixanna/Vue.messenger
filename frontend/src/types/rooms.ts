import type {
  User,
} from '@/types/users';

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

/**
 * Тег комнаты
 */
export interface Tag {
  tag_id: string;
  name: string;
  order: number;
}

/**
 * Ключевое слово комнаты
 */
export interface Keyword {
  name: string;
  order: number;
}

export interface RoomDetails {
  id: string;
  name: string;
  is_public: boolean;
  is_files_allowed: boolean;
  created_at: string;
  users: User[];
  tags: Tag[];
  keywords: Keyword[];
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
  tags: Tag[];
  keywords: Keyword[];

  selected: boolean;
  details?: RoomDetails;
}