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
  // Define a URL base para metadados. Use uma variável de ambiente para produção.
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'),
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
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002', // Adiciona a URL canônica aqui também
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemeTrade Pro',
    description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
    images: ['/logo-social.png'],
    // Adicione o site e o creator se tiver um handle do Twitter
    // site: '@seuTwitterHandle',
    // creator: '@seuTwitterHandle',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png', // Exemplo de ícone para Apple
  },
  themeColor: '#a020f0',
  // Adicione outros metadados relevantes aqui
  // keywords: ['memecoin', 'trade', 'crypto', 'alertas', 'investimento'],
  // authors: [{ name: 'MemeTrade Pro Team', url: process.env.NEXT_PUBLIC_APP_URL }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* next/font otimiza o carregamento de fontes, não são necessários preconnects manuais aqui */}
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
