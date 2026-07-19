
export interface User {
  id: string;
  username: string;
  full_name: string;
  status: UserStatus;
  
  current: boolean;
  // selected: boolean;
  // is_superuser: boolean;

  is_invite_accepted: boolean;
  is_creator: boolean;
  is_modder: boolean;
  can_write: boolean;
  can_invite: boolean;

  roomRights: Map<string, RoomRights>;
}

export interface UserStatus {
  is_online: boolean;
  timestamp: string;
}

export interface RoomRights {
  is_invite_accepted: boolean;
  is_creator: boolean;
  is_modder: boolean;
  can_write: boolean;
  can_invite: boolean;
}

export interface RoomRightsPayload {
  is_invite_accepted: boolean;
  is_creator: boolean;
  is_modder: boolean;
  can_write: boolean;
  can_invite: boolean;
}