export interface NotificationEvent {
  type: string;
  data: Record<string, unknown>;
}

export interface StatusEvent {
  id: string;
  status: {
    is_online: boolean;
    timestamp: string;
  };
}