
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'MemeTrade Pro',
  description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
  openGraph: {
    title: 'MemeTrade Pro',
    description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
    images: [
      {
        url: '/logo-social.png',
        width: 1200,
        height: 630,
        alt: 'MemeTrade Pro Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemeTrade Pro',
    description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
    images: ['/logo-social.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png', // Standard favicon
  },
  themeColor: '#a020f0', // Theme color for PWA and browsers
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Font preconnect and font style links */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
        {/* Other critical head tags not manageable by metadata can go here, but keep it minimal */}
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
