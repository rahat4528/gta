import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Mission Briefings | Tactical Intelligence Stream',
  description: 'AI Mission Briefing Interface with streaming token delivery, server-side validated tool calling, and structured intelligence cards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-intel-bg text-intel-text antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
