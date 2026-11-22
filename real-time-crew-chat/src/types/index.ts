export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';
export type ChannelType = 'TEXT' | 'VOICE' | 'DM';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  statusMessage: string | null;
  isOnline: boolean;
  lastSeenAt: string;
}

export interface CrewSummary {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  inviteCode: string;
  ownerId: string;
  role: Role;
  unreadCount?: number;
}

export interface ChannelSummary {
  id: string;
  crewId: string;
  name: string;
  topic: string | null;
  type: ChannelType;
  unreadCount?: number;
}

export interface ReactionGroup {
  emoji: string;
  count: number;
  users: { id: string; username: string }[];
  hasReacted: boolean;
}

export interface MessageItem {
  id: string;
  channelId: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  content: string;
  clientTempId?: string;
  isEdited: boolean;
  isDeleted: boolean;
  replyToId?: string | null;
  replyTo?: {
    id: string;
    content: string;
    sender: { username: string };
  } | null;
  reactions: ReactionGroup[];
  attachments: {
    id: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  }[];
  status?: 'sending' | 'sent' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  channelId: string;
  timestamp: number;
}

// Socket.IO Events Schema
export interface ServerToClientEvents {
  'message:new': (message: MessageItem) => void;
  'message:ack': (data: { clientTempId: string; messageId: string; status: 'ok' | 'error' }) => void;
  'message:edited': (message: MessageItem) => void;
  'message:deleted': (data: { messageId: string; channelId: string }) => void;
  'reaction:updated': (data: { messageId: string; reactions: ReactionGroup[] }) => void;
  'typing:update': (data: { channelId: string; typers: string[] }) => void;
  'presence:update': (data: { userId: string; isOnline: boolean; lastSeenAt: string }) => void;
  'presence:sync': (onlineUserIds: string[]) => void;
  'resync:complete': (data: { channelId: string; messages: MessageItem[] }) => void;
  'error:event': (data: { code: string; message: string }) => void;
}

export interface ClientToServerEvents {
  'crew:join': (crewId: string) => void;
  'crew:leave': (crewId: string) => void;
  'channel:join': (channelId: string) => void;
  'channel:leave': (channelId: string) => void;
  'message:send': (
    data: {
      channelId: string;
      content: string;
      clientTempId: string;
      replyToId?: string | null;
    },
    ack?: (response: { status: 'ok' | 'error'; message?: MessageItem; error?: string }) => void
  ) => void;
  'message:edit': (data: { messageId: string; content: string }) => void;
  'message:delete': (data: { messageId: string }) => void;
  'message:reaction': (data: { messageId: string; emoji: string }) => void;
  'typing:start': (data: { channelId: string }) => void;
  'typing:stop': (data: { channelId: string }) => void;
  'presence:get': (data: { crewId: string }) => void;
  'resync:messages': (data: { channelId: string; lastMessageId?: string; lastTimestamp?: string }) => void;
}
