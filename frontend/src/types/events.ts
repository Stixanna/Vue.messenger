export interface DrySSEEvent {
  type: string;
  data: Record<string, unknown>;
}

export interface EventPayload {
  action: string;
  data: Record<string, unknown>;
}
