import type { Metadata } from 'next';
import { config } from '@/config/config';

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description as string} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
