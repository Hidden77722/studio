import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['500', '600', '700', '800']
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'),
  title: 'MemeTrade Pro',
  description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
  manifest: '/manifest.json',
  themeColor: '#A020F0', // Primary color
  icons: {
    icon: '/favicon.png', // Standard favicon
    apple: '/apple-touch-icon.png', // For Apple devices, e.g. 180x180
  },
  openGraph: {
    title: 'MemeTrade Pro',
    description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002',
    siteName: 'MemeTrade Pro',
    images: [
      {
        url: '/logo-social.png', // Must be an absolute URL or Next.js will prefix with metadataBase
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
    images: ['/logo-social.png'], // Must be an absolute URL or Next.js will prefix with metadataBase
    // site: '@memetradepro', // Optional: your Twitter handle
    // creator: '@creatorhandle', // Optional: creator's Twitter handle
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* next/font otimiza o carregamento de fontes, não são necessários preconnects manuais para Google Fonts aqui se usando next/font */}
        {/* Outras tags <head> globais podem ser adicionadas aqui se necessário, mas prefira o objeto metadata */}
      </head>
      <body className={`font-body antialiased bg-background text-foreground`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
