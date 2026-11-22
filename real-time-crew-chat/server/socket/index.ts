import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken } from '../../src/lib/auth/jwt';
import { dbService } from '../services/db';
import { ClientToServerEvents, ServerToClientEvents } from '../../src/types';

interface SocketData {
  user: {
    userId: string;
    username: string;
    email: string;
  };
}

export function initSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  // Track connected sockets per user to accurately maintain presence
  const userSockets = new Map<string, Set<string>>();

  // Channel typing state: channelId -> Map<userId, { username: string, timeout: NodeJS.Timeout }>
  const typingState = new Map<string, Map<string, { username: string; timer: NodeJS.Timeout }>>();

  // Socket Auth Middleware
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token as string | undefined;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return next(new Error('Invalid or expired token'));
    }

    socket.data.user = payload;
    next();
  });

  io.on('connection', async (socket) => {
    const user = socket.data.user;
    if (!user) {
      socket.disconnect();
      return;
    }

    const userId = user.userId;

    // Track user socket
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId)!.add(socket.id);

    // Join user's personal room for direct notification events
    socket.join(`user:${userId}`);

    // Update presence: Online
    await dbService.updateUserPresence(userId, true);
    io.emit('presence:update', {
      userId,
      isOnline: true,
      lastSeenAt: new Date().toISOString(),
    });

    // 1. Crew Room Joining & Leaving
    socket.on('crew:join', (crewId: string) => {
      socket.join(`crew:${crewId}`);
    });

    socket.on('crew:leave', (crewId: string) => {
      socket.leave(`crew:${crewId}`);
    });

    // 2. Channel Room Joining & Leaving
    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel:${channelId}`);
    });

    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
    });

    // 3. Instant Real-Time Messaging with Idempotency & ACK
    socket.on('message:send', async (data, ack) => {
      try {
        const { channelId, content, clientTempId, replyToId } = data;
        if (!channelId || !content.trim()) {
          if (ack) ack({ status: 'error', error: 'Content cannot be empty' });
          return;
        }

        // Idempotent write: duplicate clientTempId returns existing message!
        const savedMessage = await dbService.saveMessage({
          channelId,
          senderId: userId,
          content: content.trim(),
          clientTempId,
          replyToId,
        });

        // Acknowledge back to sender immediately
        if (ack) {
          ack({ status: 'ok', message: savedMessage });
        }

        // Broadcast to entire channel room
        io.to(`channel:${channelId}`).emit('message:new', savedMessage);
      } catch (err: any) {
        console.error('Error handling message:send:', err);
        if (ack) {
          ack({ status: 'error', error: err.message || 'Failed to save message' });
        }
      }
    });

    // 4. Edit Message
    socket.on('message:edit', async ({ messageId, content }) => {
      try {
        const updated = await dbService.editMessage(messageId, userId, content);
        if (updated) {
          io.to(`channel:${updated.channelId}`).emit('message:edited', updated);
        }
      } catch (err) {
        console.error('Error handling message:edit:', err);
      }
    });

    // 5. Delete Message
    socket.on('message:delete', async ({ messageId }) => {
      try {
        const msg = (dbService as any).messages.get(messageId);
        const channelId = msg?.channelId;
        const success = await dbService.deleteMessage(messageId, userId);
        if (success && channelId) {
          io.to(`channel:${channelId}`).emit('message:deleted', { messageId, channelId });
        }
      } catch (err) {
        console.error('Error handling message:delete:', err);
      }
    });

    // 6. Message Reactions
    socket.on('message:reaction', async ({ messageId, emoji }) => {
      try {
        const reactions = await dbService.toggleReaction(messageId, userId, user.username, emoji);
        const msg = (dbService as any).messages.get(messageId);
        if (msg) {
          io.to(`channel:${msg.channelId}`).emit('reaction:updated', {
            messageId,
            reactions,
          });
        }
      } catch (err) {
        console.error('Error handling message:reaction:', err);
      }
    });

    // 7. Typing Indicators (with auto-expiring stale state)
    socket.on('typing:start', ({ channelId }) => {
      if (!typingState.has(channelId)) {
        typingState.set(channelId, new Map());
      }
      const channelTypers = typingState.get(channelId)!;

      // Clear existing timer if any
      const existing = channelTypers.get(userId);
      if (existing) clearTimeout(existing.timer);

      // Auto-expire after 3 seconds
      const timer = setTimeout(() => {
        channelTypers.delete(userId);
        const currentTypers = Array.from(channelTypers.values()).map((t) => t.username);
        io.to(`channel:${channelId}`).emit('typing:update', { channelId, typers: currentTypers });
      }, 3000);

      channelTypers.set(userId, { username: user.username, timer });
      const currentTypers = Array.from(channelTypers.values()).map((t) => t.username);
      io.to(`channel:${channelId}`).emit('typing:update', { channelId, typers: currentTypers });
    });

    socket.on('typing:stop', ({ channelId }) => {
      const channelTypers = typingState.get(channelId);
      if (channelTypers && channelTypers.has(userId)) {
        clearTimeout(channelTypers.get(userId)!.timer);
        channelTypers.delete(userId);
        const currentTypers = Array.from(channelTypers.values()).map((t) => t.username);
        io.to(`channel:${channelId}`).emit('typing:update', { channelId, typers: currentTypers });
      }
    });

    // 8. Presence Sync
    socket.on('presence:get', async ({ crewId }) => {
      const members = await dbService.getCrewMembers(crewId);
      const onlineUserIds = members
        .filter((m) => userSockets.has(m.user.id) && userSockets.get(m.user.id)!.size > 0)
        .map((m) => m.user.id);
      socket.emit('presence:sync', onlineUserIds);
    });

    // 9. Reconnection Resync: catches up all missed messages since last seen
    socket.on('resync:messages', async ({ channelId, lastTimestamp }) => {
      try {
        const missedMessages = await dbService.getMessagesAfter(channelId, lastTimestamp);
        socket.emit('resync:complete', { channelId, messages: missedMessages });
      } catch (err) {
        console.error('Error handling resync:messages:', err);
      }
    });

    // Disconnect Handler
    socket.on('disconnect', async () => {
      const userSocketsSet = userSockets.get(userId);
      if (userSocketsSet) {
        userSocketsSet.delete(socket.id);
        if (userSocketsSet.size === 0) {
          userSockets.delete(userId);
          // Mark user as offline
          await dbService.updateUserPresence(userId, false);
          io.emit('presence:update', {
            userId,
            isOnline: false,
            lastSeenAt: new Date().toISOString(),
          });
        }
      }
    });
  });

  return io;
}
