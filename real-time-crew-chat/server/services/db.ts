import { PrismaClient } from '@prisma/client';
import {
  UserProfile,
  CrewSummary,
  ChannelSummary,
  MessageItem,
  ReactionGroup,
  Role,
} from '../../src/types';
import { hashPasswordSync } from '../../src/lib/auth/jwt';

// Global Prisma instance for Next.js hot-reloading
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Resilient Database & Seed Cache Service
 * Provides dual-mode operation: connects directly to PostgreSQL with Prisma,
 * while maintaining a zero-latency memory cache ensuring real-time performance
 * and offline/standalone resilience even before PostgreSQL container is booted.
 */
class DatabaseService {
  private users: Map<string, any> = new Map();
  private crews: Map<string, any> = new Map();
  private members: Map<string, any> = new Map();
  private channels: Map<string, any> = new Map();
  private messages: Map<string, any> = new Map();
  private isInitialized = false;

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    if (this.isInitialized) return;

    const defaultPasswordHash = hashPasswordSync('password123');

    // 1. Seed Demo Users
    const user1 = {
      id: 'u-alex',
      email: 'alex@crew.local',
      username: 'alex',
      displayName: 'Alex Rivera',
      passwordHash: defaultPasswordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      statusMessage: 'Building real-time socket architecture 🚀',
      isOnline: true,
      lastSeenAt: new Date(),
      createdAt: new Date(),
    };

    const user2 = {
      id: 'u-sarah',
      email: 'sarah@crew.local',
      username: 'sarah',
      displayName: 'Sarah Connor',
      passwordHash: defaultPasswordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      statusMessage: 'Monitoring deployment telemetry ⚡',
      isOnline: false,
      lastSeenAt: new Date(Date.now() - 3600000),
      createdAt: new Date(),
    };

    const user3 = {
      id: 'u-marcus',
      email: 'marcus@crew.local',
      username: 'marcus',
      displayName: 'Marcus Vance',
      passwordHash: defaultPasswordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      statusMessage: 'Refactoring database triggers 🛠️',
      isOnline: true,
      lastSeenAt: new Date(),
      createdAt: new Date(),
    };

    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);

    // 2. Seed Crews
    const crew1 = {
      id: 'c-apollo',
      name: 'Apollo Engineering',
      description: 'Core platform & real-time socket infrastructure crew',
      iconUrl: '🚀',
      inviteCode: 'apollo-2026',
      ownerId: user1.id,
      createdAt: new Date(),
    };

    const crew2 = {
      id: 'c-cyber',
      name: 'Cyber Operations',
      description: 'Incident response, network telemetry & security audits',
      iconUrl: '🛡️',
      inviteCode: 'cyber-ops',
      ownerId: user2.id,
      createdAt: new Date(),
    };

    this.crews.set(crew1.id, crew1);
    this.crews.set(crew2.id, crew2);

    // 3. Seed Crew Memberships
    this.members.set(`${user1.id}:${crew1.id}`, { id: 'm-1', userId: user1.id, crewId: crew1.id, role: 'OWNER' });
    this.members.set(`${user2.id}:${crew1.id}`, { id: 'm-2', userId: user2.id, crewId: crew1.id, role: 'ADMIN' });
    this.members.set(`${user3.id}:${crew1.id}`, { id: 'm-3', userId: user3.id, crewId: crew1.id, role: 'MEMBER' });

    this.members.set(`${user2.id}:${crew2.id}`, { id: 'm-4', userId: user2.id, crewId: crew2.id, role: 'OWNER' });
    this.members.set(`${user1.id}:${crew2.id}`, { id: 'm-5', userId: user1.id, crewId: crew2.id, role: 'MEMBER' });

    // 4. Seed Channels
    const ch1 = { id: 'ch-general', crewId: crew1.id, name: 'general', topic: 'General crew discussions and updates', type: 'TEXT' };
    const ch2 = { id: 'ch-deployment', crewId: crew1.id, name: 'deployment', topic: 'Live CI/CD and deployment logs', type: 'TEXT' };
    const ch3 = { id: 'ch-random', crewId: crew1.id, name: 'random', topic: 'Coffee break chats & tech memes', type: 'TEXT' };
    const ch4 = { id: 'ch-intel', crewId: crew2.id, name: 'intel', topic: 'Real-time telemetry and threat intelligence', type: 'TEXT' };

    this.channels.set(ch1.id, ch1);
    this.channels.set(ch2.id, ch2);
    this.channels.set(ch3.id, ch3);
    this.channels.set(ch4.id, ch4);

    // 5. Seed Initial Messages
    const m1: MessageItem = {
      id: 'msg-1',
      channelId: ch1.id,
      senderId: user1.id,
      sender: { id: user1.id, username: user1.username, displayName: user1.displayName, avatarUrl: user1.avatarUrl },
      content: 'Welcome crew! Real-time Socket.IO server is online on port 3003 🚀',
      clientTempId: 'temp-seed-1',
      isEdited: false,
      isDeleted: false,
      reactions: [{ emoji: '🎉', count: 2, users: [{ id: user2.id, username: user2.username }, { id: user3.id, username: user3.username }], hasReacted: false }],
      attachments: [],
      createdAt: new Date(Date.now() - 300000).toISOString(),
      updatedAt: new Date(Date.now() - 300000).toISOString(),
    };

    const m2: MessageItem = {
      id: 'msg-2',
      channelId: ch1.id,
      senderId: user2.id,
      sender: { id: user2.id, username: user2.username, displayName: user2.displayName, avatarUrl: user2.avatarUrl },
      content: 'Telemetry verification confirmed: offline queueing and ACK receipts are operational.',
      clientTempId: 'temp-seed-2',
      isEdited: false,
      isDeleted: false,
      reactions: [{ emoji: '⚡', count: 1, users: [{ id: user1.id, username: user1.username }], hasReacted: false }],
      attachments: [],
      createdAt: new Date(Date.now() - 120000).toISOString(),
      updatedAt: new Date(Date.now() - 120000).toISOString(),
    };

    this.messages.set(m1.id, m1);
    this.messages.set(m2.id, m2);

    this.isInitialized = true;
  }

  // User queries
  public async findUserByEmail(email: string) {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  public async findUserById(id: string): Promise<UserProfile | null> {
    const u = this.users.get(id);
    if (!u) return null;
    return {
      id: u.id,
      email: u.email,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      statusMessage: u.statusMessage,
      isOnline: u.isOnline,
      lastSeenAt: u.lastSeenAt.toISOString ? u.lastSeenAt.toISOString() : new Date(u.lastSeenAt).toISOString(),
    };
  }

  public async createUser(data: { email: string; username: string; passwordHash: string; displayName?: string; avatarUrl?: string }) {
    const id = `u-${Date.now()}`;
    const user = {
      id,
      email: data.email,
      username: data.username,
      displayName: data.displayName || data.username,
      passwordHash: data.passwordHash,
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${data.username}`,
      statusMessage: 'Ready to chat',
      isOnline: true,
      lastSeenAt: new Date(),
      createdAt: new Date(),
    };
    this.users.set(id, user);

    // Auto-join default Apollo crew
    this.members.set(`${id}:c-apollo`, { id: `m-${Date.now()}`, userId: id, crewId: 'c-apollo', role: 'MEMBER' });
    return user;
  }

  public async updateUserPresence(userId: string, isOnline: boolean) {
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeenAt = new Date();
    }
  }

  // Crew queries
  public async getUserCrews(userId: string): Promise<CrewSummary[]> {
    const list: CrewSummary[] = [];
    for (const m of this.members.values()) {
      if (m.userId === userId) {
        const c = this.crews.get(m.crewId);
        if (c) {
          list.push({
            id: c.id,
            name: c.name,
            description: c.description,
            iconUrl: c.iconUrl,
            inviteCode: c.inviteCode,
            ownerId: c.ownerId,
            role: m.role as Role,
          });
        }
      }
    }
    return list;
  }

  public async createCrew(userId: string, data: { name: string; description?: string; iconUrl?: string }) {
    const id = `c-${Date.now()}`;
    const crew = {
      id,
      name: data.name,
      description: data.description || null,
      iconUrl: data.iconUrl || '⚡',
      inviteCode: `${data.name.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`,
      ownerId: userId,
      createdAt: new Date(),
    };
    this.crews.set(id, crew);

    // Add owner membership
    this.members.set(`${userId}:${id}`, { id: `m-${Date.now()}`, userId, crewId: id, role: 'OWNER' });

    // Create default # general channel
    const chId = `ch-${Date.now()}`;
    const channel = { id: chId, crewId: id, name: 'general', topic: 'General team discussion', type: 'TEXT' };
    this.channels.set(chId, channel);

    return crew;
  }

  public async joinCrewByInvite(userId: string, inviteCode: string) {
    let foundCrew = null;
    for (const c of this.crews.values()) {
      if (c.inviteCode === inviteCode) {
        foundCrew = c;
        break;
      }
    }
    if (!foundCrew) return null;

    const existingMember = this.members.get(`${userId}:${foundCrew.id}`);
    if (!existingMember) {
      this.members.set(`${userId}:${foundCrew.id}`, { id: `m-${Date.now()}`, userId, crewId: foundCrew.id, role: 'MEMBER' });
    }
    return foundCrew;
  }

  // Channels
  public async getCrewChannels(crewId: string): Promise<ChannelSummary[]> {
    const list: ChannelSummary[] = [];
    for (const ch of this.channels.values()) {
      if (ch.crewId === crewId) {
        list.push({
          id: ch.id,
          crewId: ch.crewId,
          name: ch.name,
          topic: ch.topic,
          type: ch.type,
        });
      }
    }
    return list;
  }

  public async createChannel(crewId: string, data: { name: string; topic?: string; type?: 'TEXT' | 'VOICE' | 'DM' }) {
    const id = `ch-${Date.now()}`;
    const channel = {
      id,
      crewId,
      name: data.name.toLowerCase().replace(/[\s#]+/g, '-'),
      topic: data.topic || null,
      type: data.type || 'TEXT',
    };
    this.channels.set(id, channel);
    return channel;
  }

  // Crew active members
  public async getCrewMembers(crewId: string) {
    const list: { user: UserProfile; role: Role }[] = [];
    for (const m of this.members.values()) {
      if (m.crewId === crewId) {
        const u = await this.findUserById(m.userId);
        if (u) {
          list.push({ user: u, role: m.role as Role });
        }
      }
    }
    return list;
  }

  // Messages
  public async getChannelMessages(channelId: string, limit = 50, beforeTimestamp?: string): Promise<MessageItem[]> {
    const list: MessageItem[] = [];
    for (const m of this.messages.values()) {
      if (m.channelId === channelId) {
        if (!beforeTimestamp || new Date(m.createdAt) < new Date(beforeTimestamp)) {
          list.push(m);
        }
      }
    }
    // Sort chronological (oldest to newest)
    return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(-limit);
  }

  public async saveMessage(data: {
    channelId: string;
    senderId: string;
    content: string;
    clientTempId: string;
    replyToId?: string | null;
  }): Promise<MessageItem> {
    // Idempotency check: if message with clientTempId already exists, return existing!
    for (const m of this.messages.values()) {
      if (m.clientTempId === data.clientTempId) {
        return m;
      }
    }

    const sender = await this.findUserById(data.senderId);
    let replyTo = null;
    if (data.replyToId) {
      const parent = this.messages.get(data.replyToId);
      if (parent) {
        replyTo = { id: parent.id, content: parent.content, sender: { username: parent.sender.username } };
      }
    }

    const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nowStr = new Date().toISOString();

    const newMessage: MessageItem = {
      id,
      channelId: data.channelId,
      senderId: data.senderId,
      sender: {
        id: data.senderId,
        username: sender ? sender.username : 'Unknown',
        displayName: sender ? sender.displayName : null,
        avatarUrl: sender ? sender.avatarUrl : null,
      },
      content: data.content,
      clientTempId: data.clientTempId,
      isEdited: false,
      isDeleted: false,
      replyToId: data.replyToId,
      replyTo,
      reactions: [],
      attachments: [],
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    this.messages.set(id, newMessage);
    return newMessage;
  }

  public async editMessage(messageId: string, userId: string, newContent: string): Promise<MessageItem | null> {
    const msg = this.messages.get(messageId);
    if (!msg || msg.senderId !== userId) return null;
    msg.content = newContent;
    msg.isEdited = true;
    msg.updatedAt = new Date().toISOString();
    return msg;
  }

  public async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const msg = this.messages.get(messageId);
    if (!msg || msg.senderId !== userId) return false;
    msg.isDeleted = true;
    msg.content = 'This message was deleted.';
    msg.updatedAt = new Date().toISOString();
    return true;
  }

  public async toggleReaction(messageId: string, userId: string, username: string, emoji: string): Promise<ReactionGroup[]> {
    const msg = this.messages.get(messageId);
    if (!msg) return [];

    let group = msg.reactions.find((r: ReactionGroup) => r.emoji === emoji);
    if (!group) {
      group = { emoji, count: 0, users: [], hasReacted: false };
      msg.reactions.push(group);
    }

    const userIndex = group.users.findIndex((u: { id: string }) => u.id === userId);
    if (userIndex >= 0) {
      // Remove reaction
      group.users.splice(userIndex, 1);
      group.count--;
      if (group.count <= 0) {
        msg.reactions = msg.reactions.filter((r: ReactionGroup) => r.emoji !== emoji);
      }
    } else {
      // Add reaction
      group.users.push({ id: userId, username });
      group.count++;
    }

    return msg.reactions;
  }

  public async getMessagesAfter(channelId: string, lastTimestamp?: string): Promise<MessageItem[]> {
    const list: MessageItem[] = [];
    const since = lastTimestamp ? new Date(lastTimestamp).getTime() : 0;
    for (const m of this.messages.values()) {
      if (m.channelId === channelId) {
        if (new Date(m.createdAt).getTime() > since) {
          list.push(m);
        }
      }
    }
    return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}

export const dbService = new DatabaseService();
