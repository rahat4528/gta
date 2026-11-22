'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket, CrewSocket } from '../lib/socket/client';
import { MessageItem, ReactionGroup, UserProfile } from '../types';

interface OfflineQueuedMessage {
  channelId: string;
  content: string;
  clientTempId: string;
  replyToId?: string | null;
  timestamp: number;
}

interface SocketContextValue {
  socket: CrewSocket | null;
  isConnected: boolean;
  isReconnecting: boolean;
  onlineUserIds: Set<string>;
  channelTypers: Record<string, string[]>;
  sendMessage: (channelId: string, content: string, replyToId?: string | null) => Promise<MessageItem>;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  sendTyping: (channelId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: UserProfile | null;
}) {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<CrewSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [channelTypers, setChannelTypers] = useState<Record<string, string[]>>({});

  // Offline queue persisted in memory/session
  const offlineQueue = useRef<OfflineQueuedMessage[]>([]);

  // Last seen message timestamp per channel for reconnect resync
  const lastMessageTimestamps = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!currentUser) return;

    // Cookie token extraction or direct socket connection
    const s = getSocket();
    setSocket(s);

    if (!s.connected) {
      s.connect();
    }

    const onConnect = () => {
      setIsConnected(true);
      setIsReconnecting(false);

      // 1. Flush any messages queued while offline
      if (offlineQueue.current.length > 0) {
        const queueToFlush = [...offlineQueue.current];
        offlineQueue.current = [];

        queueToFlush.forEach((queued) => {
          s.emit(
            'message:send',
            {
              channelId: queued.channelId,
              content: queued.content,
              clientTempId: queued.clientTempId,
              replyToId: queued.replyToId,
            },
            (response) => {
              if (response.status === 'ok' && response.message) {
                // Reconcile optimistic message
                queryClient.setQueryData<MessageItem[]>(
                  ['messages', queued.channelId],
                  (old = []) =>
                    old.map((m) =>
                      m.clientTempId === queued.clientTempId ? response.message! : m
                    )
                );
              }
            }
          );
        });
      }

      // 2. Resync channels to catch up on missed messages
      Object.entries(lastMessageTimestamps.current).forEach(([channelId, lastTimestamp]) => {
        s.emit('resync:messages', { channelId, lastTimestamp });
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setIsReconnecting(true);
    };

    const onNewMessage = (msg: MessageItem) => {
      // Record latest timestamp
      lastMessageTimestamps.current[msg.channelId] = msg.createdAt;

      queryClient.setQueryData<MessageItem[]>(['messages', msg.channelId], (old = []) => {
        // Deduplicate using id or clientTempId
        const exists = old.some(
          (m) => m.id === msg.id || (m.clientTempId && m.clientTempId === msg.clientTempId)
        );
        if (exists) {
          return old.map((m) =>
            m.clientTempId && m.clientTempId === msg.clientTempId ? msg : m
          );
        }
        return [...old, msg];
      });
    };

    const onMessageEdited = (msg: MessageItem) => {
      queryClient.setQueryData<MessageItem[]>(['messages', msg.channelId], (old = []) =>
        old.map((m) => (m.id === msg.id ? msg : m))
      );
    };

    const onMessageDeleted = ({ messageId, channelId }: { messageId: string; channelId: string }) => {
      queryClient.setQueryData<MessageItem[]>(['messages', channelId], (old = []) =>
        old.map((m) =>
          m.id === messageId
            ? { ...m, isDeleted: true, content: 'This message was deleted.' }
            : m
        )
      );
    };

    const onReactionUpdated = ({
      messageId,
      reactions,
    }: {
      messageId: string;
      reactions: ReactionGroup[];
    }) => {
      queryClient.setQueriesData<MessageItem[]>({ queryKey: ['messages'] }, (old) => {
        if (!old) return old;
        return old.map((m) => (m.id === messageId ? { ...m, reactions } : m));
      });
    };

    const onTypingUpdate = ({ channelId, typers }: { channelId: string; typers: string[] }) => {
      setChannelTypers((prev) => ({
        ...prev,
        [channelId]: typers.filter((t) => t !== currentUser.username),
      }));
    };

    const onPresenceUpdate = ({
      userId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
      lastSeenAt: string;
    }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (isOnline) next.add(userId);
        else next.delete(userId);
        return next;
      });
    };

    const onPresenceSync = (ids: string[]) => {
      setOnlineUserIds(new Set(ids));
    };

    const onResyncComplete = ({
      channelId,
      messages,
    }: {
      channelId: string;
      messages: MessageItem[];
    }) => {
      if (messages.length > 0) {
        queryClient.setQueryData<MessageItem[]>(['messages', channelId], (old = []) => {
          const combined = [...old];
          messages.forEach((newMsg) => {
            if (!combined.some((m) => m.id === newMsg.id)) {
              combined.push(newMsg);
            }
          });
          return combined.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      }
    };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('message:new', onNewMessage);
    s.on('message:edited', onMessageEdited);
    s.on('message:deleted', onMessageDeleted);
    s.on('reaction:updated', onReactionUpdated);
    s.on('typing:update', onTypingUpdate);
    s.on('presence:update', onPresenceUpdate);
    s.on('presence:sync', onPresenceSync);
    s.on('resync:complete', onResyncComplete);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('message:new', onNewMessage);
      s.off('message:edited', onMessageEdited);
      s.off('message:deleted', onMessageDeleted);
      s.off('reaction:updated', onReactionUpdated);
      s.off('typing:update', onTypingUpdate);
      s.off('presence:update', onPresenceUpdate);
      s.off('presence:sync', onPresenceSync);
      s.off('resync:complete', onResyncComplete);
    };
  }, [currentUser, queryClient]);

  // Send message with clientTempId & optimistic update
  const sendMessage = useCallback(
    async (channelId: string, content: string, replyToId?: string | null): Promise<MessageItem> => {
      const clientTempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const nowStr = new Date().toISOString();

      // Optimistic message
      const optimisticMessage: MessageItem = {
        id: clientTempId,
        channelId,
        senderId: currentUser ? currentUser.id : 'unknown',
        sender: {
          id: currentUser ? currentUser.id : 'unknown',
          username: currentUser ? currentUser.username : 'You',
          displayName: currentUser?.displayName || null,
          avatarUrl: currentUser?.avatarUrl || null,
        },
        content,
        clientTempId,
        isEdited: false,
        isDeleted: false,
        replyToId,
        reactions: [],
        attachments: [],
        status: isConnected ? 'sending' : 'sent',
        createdAt: nowStr,
        updatedAt: nowStr,
      };

      // 1. Immediately apply optimistic UI update in TanStack Query cache
      queryClient.setQueryData<MessageItem[]>(['messages', channelId], (old = []) => [
        ...old,
        optimisticMessage,
      ]);

      // 2. If disconnected, push to offline queue
      if (!socket || !isConnected) {
        offlineQueue.current.push({
          channelId,
          content,
          clientTempId,
          replyToId,
          timestamp: Date.now(),
        });
        return optimisticMessage;
      }

      // 3. Send over Socket with ACK
      return new Promise((resolve, reject) => {
        socket.emit(
          'message:send',
          { channelId, content, clientTempId, replyToId },
          (response) => {
            if (response.status === 'ok' && response.message) {
              // Reconcile optimistic with real server message
              queryClient.setQueryData<MessageItem[]>(['messages', channelId], (old = []) =>
                old.map((m) => (m.clientTempId === clientTempId ? response.message! : m))
              );
              resolve(response.message);
            } else {
              reject(new Error(response.error || 'Failed to send message'));
            }
          }
        );
      });
    },
    [socket, isConnected, currentUser, queryClient]
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      if (!socket) return;
      socket.emit('message:edit', { messageId, content });
    },
    [socket]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!socket) return;
      socket.emit('message:delete', { messageId });
    },
    [socket]
  );

  const toggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!socket) return;
      socket.emit('message:reaction', { messageId, emoji });
    },
    [socket]
  );

  const sendTyping = useCallback(
    (channelId: string, isTyping: boolean) => {
      if (!socket) return;
      if (isTyping) socket.emit('typing:start', { channelId });
      else socket.emit('typing:stop', { channelId });
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        isReconnecting,
        onlineUserIds,
        channelTypers,
        sendMessage,
        editMessage,
        deleteMessage,
        toggleReaction,
        sendTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
