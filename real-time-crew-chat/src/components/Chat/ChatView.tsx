'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChannelSummary,
  CrewSummary,
  MessageItem,
  UserProfile,
} from '../../types';
import { SocketProvider, useSocket } from '../../hooks/useSocket';
import { CrewSidebar } from '../Channels/CrewSidebar';
import { ChannelSidebar } from '../Channels/ChannelSidebar';
import { MessageList } from '../Messages/MessageList';
import { MessageInput } from '../Messages/MessageInput';
import { PresenceList, CrewMemberItem } from '../Presence/PresenceList';
import { CreateCrewModal } from '../Modals/CreateCrewModal';
import { JoinCrewModal } from '../Modals/JoinCrewModal';
import { CreateChannelModal } from '../Modals/CreateChannelModal';
import { ProfileModal } from '../Modals/ProfileModal';

interface ChatViewProps {
  initialUser: UserProfile;
  initialCrews: CrewSummary[];
}

export function ChatView({ initialUser, initialCrews }: ChatViewProps) {
  return (
    <SocketProvider currentUser={initialUser}>
      <ChatViewInner initialUser={initialUser} initialCrews={initialCrews} />
    </SocketProvider>
  );
}

function ChatViewInner({
  initialUser,
  initialCrews,
}: {
  initialUser: UserProfile;
  initialCrews: CrewSummary[];
}) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUser);
  const [crews, setCrews] = useState<CrewSummary[]>(initialCrews);
  const [activeCrewId, setActiveCrewId] = useState<string | null>(
    initialCrews.length > 0 ? initialCrews[0].id : null
  );
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [showPresence, setShowPresence] = useState(true);
  const [replyTo, setReplyTo] = useState<MessageItem | null>(null);

  // Modals state
  const [showCreateCrew, setShowCreateCrew] = useState(false);
  const [showJoinCrew, setShowJoinCrew] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Active crew
  const activeCrew = crews.find((c) => c.id === activeCrewId) || null;

  // Fetch channels for active crew
  const { data: channels = [] } = useQuery<ChannelSummary[]>({
    queryKey: ['channels', activeCrewId],
    queryFn: async () => {
      if (!activeCrewId) return [];
      const res = await fetch(`/api/crews/${activeCrewId}/channels`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data.channels || [];
    },
    enabled: !!activeCrewId,
  });

  // Fetch members for active crew
  const { data: members = [] } = useQuery<CrewMemberItem[]>({
    queryKey: ['members', activeCrewId],
    queryFn: async () => {
      if (!activeCrewId) return [];
      const res = await fetch(`/api/crews/${activeCrewId}/members`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data.members || [];
    },
    enabled: !!activeCrewId,
  });

  // Select default channel when channels load
  useEffect(() => {
    if (channels.length > 0) {
      const exists = channels.some((c) => c.id === activeChannelId);
      if (!exists) {
        setActiveChannelId(channels[0].id);
      }
    } else {
      setActiveChannelId(null);
    }
  }, [channels, activeChannelId]);

  // Join crew & channel rooms via socket
  useEffect(() => {
    if (!socket || !activeCrewId) return;

    socket.emit('crew:join', activeCrewId);
    socket.emit('presence:get', { crewId: activeCrewId });

    return () => {
      socket.emit('crew:leave', activeCrewId);
    };
  }, [socket, activeCrewId]);

  useEffect(() => {
    if (!socket || !activeChannelId) return;

    socket.emit('channel:join', activeChannelId);

    return () => {
      socket.emit('channel:leave', activeChannelId);
    };
  }, [socket, activeChannelId]);

  // Fetch messages for active channel
  const { data: messages = [] } = useQuery<MessageItem[]>({
    queryKey: ['messages', activeChannelId],
    queryFn: async () => {
      if (!activeChannelId) return [];
      const res = await fetch(`/api/channels/${activeChannelId}/messages`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data.messages || [];
    },
    enabled: !!activeChannelId,
  });

  const activeChannel = channels.find((c) => c.id === activeChannelId) || null;

  const handleCrewCreatedOrJoined = async (crewId: string) => {
    // Refresh crews list
    const res = await fetch('/api/crews');
    if (res.ok) {
      const updatedCrews = await res.json();
      setCrews(updatedCrews);
      setActiveCrewId(crewId);
    }
  };

  const handleChannelCreated = (channelId: string) => {
    queryClient.invalidateQueries({ queryKey: ['channels', activeCrewId] });
    setActiveChannelId(channelId);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-crew-bg">
      {/* 1. Leftmost Crew Icons Sidebar */}
      <CrewSidebar
        crews={crews}
        activeCrewId={activeCrewId}
        onSelectCrew={(id) => {
          setActiveCrewId(id);
          setActiveChannelId(null);
        }}
        onCreateCrew={() => setShowCreateCrew(true)}
        onJoinCrew={() => setShowJoinCrew(true)}
      />

      {/* 2. Channel List Sidebar */}
      <ChannelSidebar
        activeCrew={activeCrew}
        channels={channels}
        activeChannelId={activeChannelId}
        currentUser={currentUser}
        onSelectChannel={setActiveChannelId}
        onCreateChannel={() => setShowCreateChannel(true)}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* 3. Center Message Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeChannel ? (
          <>
            <MessageList
              channel={activeChannel}
              messages={messages}
              currentUser={currentUser}
              showPresence={showPresence}
              onTogglePresence={() => setShowPresence(!showPresence)}
              onReplyTo={setReplyTo}
            />
            <MessageInput
              channelId={activeChannel.id}
              replyTo={replyTo}
              onClearReply={() => setReplyTo(null)}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400">
            <h3 className="text-base font-bold text-white mb-2">No Channel Selected</h3>
            <p className="text-xs max-w-sm text-center">
              Create or select a channel from the sidebar to begin messaging with your crew.
            </p>
          </div>
        )}
      </div>

      {/* 4. Right Presence List */}
      {showPresence && <PresenceList members={members} />}

      {/* Modals */}
      <CreateCrewModal
        isOpen={showCreateCrew}
        onClose={() => setShowCreateCrew(false)}
        onCreated={handleCrewCreatedOrJoined}
      />

      <JoinCrewModal
        isOpen={showJoinCrew}
        onClose={() => setShowJoinCrew(false)}
        onJoined={handleCrewCreatedOrJoined}
      />

      {activeCrewId && (
        <CreateChannelModal
          isOpen={showCreateChannel}
          crewId={activeCrewId}
          onClose={() => setShowCreateChannel(false)}
          onCreated={handleChannelCreated}
        />
      )}

      <ProfileModal
        isOpen={showProfile}
        currentUser={currentUser}
        onClose={() => setShowProfile(false)}
        onUpdated={setCurrentUser}
        onLogout={handleLogout}
      />
    </div>
  );
}
