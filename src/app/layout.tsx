
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
  title: 'MemeTrade Pro',
  description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
  openGraph: {
    title: 'MemeTrade Pro',
    description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
    images: [
      {
        url: '/logo-social.png', // Ensure this image exists in public/
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
    images: ['/logo-social.png'], // Ensure this image exists in public/
  },
  manifest: '/manifest.json', // Ensure this file exists in public/
  icons: {
    icon: '/favicon.png', // Ensure this image exists in public/
  },
  themeColor: '#a020f0', 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* next/font handles font loading, preconnects are not strictly needed here but harmless */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /> */}
        {/* Removed direct Google Font links, next/font will manage them */}
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-body antialiased bg-background text-foreground`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
