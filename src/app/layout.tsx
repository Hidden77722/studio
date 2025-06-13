
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'MemeTrade Pro',
  description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
  // Adicionando Open Graph image meta tag
  openGraph: {
    title: 'MemeTrade Pro',
    description: 'Alertas de negociação de meme coins em tempo real com alta precisão.',
    images: [
      {
        url: '/logo-social.png', // Caminho para uma imagem na pasta public/
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
    images: ['/logo-social.png'], // Caminho para uma imagem na pasta public/
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
        {/* Adicionando link para o favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        {/* Você também pode adicionar outros tamanhos de ícone ou um favicon.ico aqui se desejar */}
        {/* Exemplo: <link rel="icon" href="/favicon.ico" sizes="any" /> */}
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
