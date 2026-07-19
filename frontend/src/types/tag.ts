export interface Tag {
  tag_id: string;
  name: string;
  order: number;
//   is_shared?: number;
//   user_id?: number;
}

export interface GlobalTag {
  id: string;
  name: string;
  count: number;
}

export interface AddTagPayload {
  tag_id: string;
  tag_name: string;
  order_num: number;
//   is_shared: number;
//   user_id: number;
}