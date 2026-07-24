import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LPU SmartFood AI — Skip the Queue, Not the Taste',
    template: '%s | LPU SmartFood AI',
  },
  description:
    'AI-powered food pre-booking and queue management for Lovely Professional University. Order via WhatsApp or web, skip the queue, get notified when ready.',
  keywords: ['LPU', 'food', 'canteen', 'pre-order', 'WhatsApp', 'AI', 'queue management'],
  authors: [{ name: 'LPU SmartFood AI Team' }],
  openGraph: {
    title: 'LPU SmartFood AI',
    description: 'Skip the queue, not the taste.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
