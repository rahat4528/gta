'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogIn, UserPlus, ArrowRight } from 'lucide-react';

const DEMO_USERS = [
  {
    name: 'Alex Rivera',
    role: 'Lead Systems Engineer',
    email: 'alex@crew.local',
    password: 'password123',
    icon: '🚀',
    crew: 'Apollo Engineering',
  },
  {
    name: 'Sarah Chen',
    role: 'Network & Security Architect',
    email: 'sarah@crew.local',
    password: 'password123',
    icon: '⚡',
    crew: 'Apollo Engineering',
  },
  {
    name: 'Marcus Vance',
    role: 'Operations & Reliability Specialist',
    email: 'marcus@crew.local',
    password: 'password123',
    icon: '🛰️',
    crew: 'Cyber Operations',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister
      ? { email, password, username, displayName }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-crew-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-crew-accent/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-crew-panel/90 border border-crew-border rounded-3xl shadow-2xl p-8 relative backdrop-blur-xl z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-crew-accent/20 border border-crew-accent/40 text-crew-accent mb-3 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Real-Time Crew Chat</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Mission-critical team coordination with idempotent reconnect & resync
          </p>
        </div>

        {/* 1-Click Demo Profiles */}
        <div className="mb-6">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Instant Demo Accounts</span>
            <span className="text-[10px] text-emerald-400 font-mono">1-Click Sign-in</span>
          </div>
          <div className="space-y-2">
            {DEMO_USERS.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => handleQuickLogin(user.email, user.password)}
                disabled={isLoading}
                className="w-full p-2.5 rounded-xl bg-crew-surface hover:bg-crew-hover border border-crew-border hover:border-crew-accent/60 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{user.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-crew-accent transition-colors">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {user.role} • <span className="text-neutral-300 font-mono">{user.crew}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-crew-accent group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 my-5">
          <div className="flex-1 h-[1px] bg-crew-border" />
          <span className="text-[11px] text-neutral-500 font-mono uppercase">Or Enter Credentials</span>
          <div className="flex-1 h-[1px] bg-crew-border" />
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-crew-surface p-1 mb-5 border border-crew-border">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isRegister
                ? 'bg-crew-accent text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isRegister
                ? 'bg-crew-accent text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. commander"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-crew-surface border border-crew-border text-white text-xs focus:outline-none focus:border-crew-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3.5 py-2 rounded-xl bg-crew-surface border border-crew-border text-white text-xs focus:outline-none focus:border-crew-accent"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@crew.local"
              required
              className="w-full px-3.5 py-2 rounded-xl bg-crew-surface border border-crew-border text-white text-xs focus:outline-none focus:border-crew-accent"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2 rounded-xl bg-crew-surface border border-crew-border text-white text-xs focus:outline-none focus:border-crew-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-2.5 rounded-xl bg-crew-accent hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center space-x-2 transition-all"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>
              {isLoading
                ? 'Authenticating...'
                : isRegister
                ? 'Create Operator Account'
                : 'Access Mission Control'}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center text-[10px] text-neutral-500">
          Encrypted Sessions • High Reliability • Idempotent Sockets
        </div>
      </div>
    </div>
  );
}
