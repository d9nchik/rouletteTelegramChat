export interface Message {
  time: Date;
  message: string;
  userID: number;
  conversationID: number;
}

export interface NotiFyAdminMessage {
  authorMessage: string;
  participantChatID?: string;
  participantMessage?: string;
  adminMessage?: string;
}
