
"use client";

import React from 'react';
import type { TwitterInfluencer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { ExternalLink, Users } from 'lucide-react';
import Link from 'next/link';

const mockInfluencers: TwitterInfluencer[] = [
  {
    id: 'elon',
    name: 'Elon Musk (Parody)',
    handle: 'elonmusk_crypto',
    description: 'Comentários frequentes sobre Dogecoin e outras criptomoedas. Suas postagens podem impactar significativamente o mercado.',
    twitterUrl: 'https://twitter.com/elonmusk',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'man face'
  },
  {
    id: 'cryptoBirb',
    name: 'CryptoBirb',
    handle: 'crypto_birb',
    description: 'Analista técnico conhecido por seus gráficos e previsões de mercado. Focado em altcoins e tendências emergentes.',
    twitterUrl: 'https://twitter.com/crypto_birb',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'bird logo'
  },
  {
    id: 'AltcoinSherpa',
    name: 'Altcoin Sherpa',
    handle: 'AltcoinSherpa',
    description: 'Fornece análises detalhadas de altcoins, incluindo muitas memecoins. Conhecido por sua abordagem educacional.',
    twitterUrl: 'https://twitter.com/AltcoinSherpa',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'mountain logo'
  },
  {
    id: 'HsakaTrades',
    name: 'Hsaka',
    handle: 'HsakaTrades',
    description: 'Trader influente com foco em price action e narrativas de mercado. Frequentemente comenta sobre o sentimento em torno de memecoins.',
    twitterUrl: 'https://twitter.com/HsakaTrades',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'abstract circle'
  },
  {
    id: 'Pentoshi',
    name: 'Pentoshi',
    handle: 'Pentosh1',
    description: 'Analista e trader respeitado, conhecido por suas perspectivas macro e calls de longo prazo, mas que também observa memecoins.',
    twitterUrl: 'https://twitter.com/Pentosh1',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'letter P'
  },
  {
    id: 'ladyofcrypto',
    name: 'Lady of Crypto',
    handle: 'LadyofCrypto1',
    description: 'Focada em encontrar gemas de memecoin de baixa capitalização e engajamento comunitário. Análises e insights sobre novas tendências.',
    twitterUrl: 'https://twitter.com/LadyofCrypto1',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'woman face'
  },
  {
    id: 'dogewhale',
    name: 'DogeWhale',
    handle: 'DogeWhaleAlert',
    description: 'Rastreia grandes transações de Dogecoin e movimentos de mercado. Frequentemente tuíta sobre tendências de memecoins e alertas de "baleias".',
    twitterUrl: 'https://twitter.com/DogeWhaleAlert',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'whale logo'
  },
  {
    id: 'memecoinmax',
    name: 'Memecoin Max',
    handle: 'MemecoinMax',
    description: 'Entusiasta de todas as coisas sobre memecoin, desde as últimas modas até análises profundas de tokenomics. Sempre de olho no próximo grande hype.',
    twitterUrl: 'https://twitter.com/MemecoinMax',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'rocket emoji'
  },
   {
    id: 'shibetoshi',
    name: 'Shibetoshi Nakamoto',
    handle: 'BillyM2k',
    description: 'Criador do Dogecoin. Embora não seja um trader, seus comentários sobre o espaço cripto e memecoins são altamente acompanhados.',
    twitterUrl: 'https://twitter.com/BillyM2k',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHintAvatar: 'doge avatar'
  }
];

export default function InfluencersPage() {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold flex items-center">
        <Users className="mr-3 h-8 w-8 text-primary" />
        Influenciadores de MemeCoin (Twitter)
      </h1>
      <p className="text-muted-foreground">
        Acompanhe o que os principais influenciadores estão falando sobre o universo das meme coins. As opiniões aqui são deles e não constituem aconselhamento financeiro.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInfluencers.map((influencer) => (
          <Card key={influencer.id} className="flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-start space-x-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={influencer.avatarUrl} alt={influencer.name} data-ai-hint={influencer.dataAiHintAvatar || "profile image"} />
                <AvatarFallback className="bg-muted text-muted-foreground">{getInitials(influencer.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-headline">{influencer.name}</CardTitle>
                <CardDescription className="text-sm text-primary hover:underline">
                  <Link href={influencer.twitterUrl} target="_blank" rel="noopener noreferrer">
                    @{influencer.handle}
                  </Link>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{influencer.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary">
                <Link href={influencer.twitterUrl} target="_blank" rel="noopener noreferrer">
                  Ver no Twitter <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
