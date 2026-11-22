'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, CrewSummary } from '../types';
import { ChatView } from '../components/Chat/ChatView';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [crews, setCrews] = useState<CrewSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessionAndCrews() {
      try {
        // 1. Verify authenticated user
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const user = await userRes.json();
        setCurrentUser(user);

        // 2. Load user's crews
        const crewsRes = await fetch('/api/crews');
        if (crewsRes.ok) {
          const crewList = await crewsRes.json();
          setCrews(crewList);
        }
      } catch (err) {
        console.error('Failed to load chat session:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    loadSessionAndCrews();
  }, [router]);

  if (isLoading || !currentUser) {
    return (
      <div className="h-screen w-screen bg-crew-bg flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-crew-accent/20 border border-crew-accent flex items-center justify-center animate-spin text-crew-accent mb-4">
          <div className="w-4 h-4 bg-crew-accent rounded-full" />
        </div>
        <p className="text-xs text-neutral-400 font-mono tracking-wider animate-pulse">
          INITIALIZING SECURE FREQUENCIES...
        </p>
      </div>
    );
  }

  return <ChatView initialUser={currentUser} initialCrews={crews} />;
}
