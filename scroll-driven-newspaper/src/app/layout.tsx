import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Los Santos Chronicle | Investigative Broadsheet',
  description:
    'San Andreas leading independent broadsheet. Investigative journalism, subterranean heists, municipal corruption, and street-level dispatches.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-paper-100 text-ink-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
