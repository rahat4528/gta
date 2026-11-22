import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '../lib/query/QueryProvider';

export const metadata: Metadata = {
  title: 'Real-Time Crew Chat | High-Reliability Team Messaging',
  description: 'Enterprise real-time team chat with idempotent messaging, network reconnect resync, presence, and typing indicators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-crew-bg text-neutral-100 antialiased overflow-hidden select-none">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
