export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type: "text" | "image" | "system";
  status: "sent" | "delivered" | "read";
  replyTo?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: string;
}

export interface ChatStore {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId: string | null;
}
