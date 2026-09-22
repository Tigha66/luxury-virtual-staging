import type { Metadata, Viewport } from 'next';
import { config } from '@/config/config';
import './globals.css';

export const metadata: Metadata = {
  title: `${config.app.name} - AI Virtual Staging for Luxury Real Estate`,
  description:
    'Stage your property photos with AI. Upload a room photo and get professional staging, MLS exports, and Instagram-ready formats in minutes.',
  metadataBase: new URL(config.app.url),
  openGraph: {
    title: `${config.app.name} - AI Virtual Staging`,
    description: 'Professional luxury real estate photo staging powered by AI',
    url: config.app.url,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.app.name} - AI Virtual Staging`,
    description: 'Professional luxury real estate photo staging powered by AI',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
