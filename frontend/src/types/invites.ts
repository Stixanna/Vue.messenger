export interface Invite {
  id: string;
  name: string;
}

export interface SendedInvite {
  user: {
    id: string,
    username: string, 
    full_name: string, 
  },
  room: {
    id: string,
    name: string
  }
}