
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { MockTweet } from '@/lib/types';
import { TweetDisplayCard } from '@/app/dashboard/components/TweetDisplayCard';
import { Rss, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const initialMockTweets: MockTweet[] = [
  {
    id: 't1',
    userName: 'Elon Musk (Parody)',
    userHandle: 'elonmusk_crypto',
    avatarUrl: 'https://placehold.co/48x48.png?text=EM',
    content: 'Dogecoin to the moon! 🚀 Literalmente. #DOGE #Memes',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    likes: 15780,
    retweets: 2340,
    replies: 875,
    imageUrl: 'https://placehold.co/600x400.png',
    coinTags: ['DOGE'],
    dataAiHint: "space dog"
  },
  {
    id: 't2',
    userName: 'CryptoInfluencerX',
    userHandle: 'AltcoinGemsDaily',
    avatarUrl: 'https://placehold.co/48x48.png?text=CI',
    content: 'Acabei de encontrar uma nova gema $SHIB x1000? 💎 Análise completa no meu canal! Link na bio. Não perca! #SHIB #Altcoin',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 minutes ago
    likes: 2100,
    retweets: 550,
    replies: 120,
    coinTags: ['SHIB'],
    dataAiHint: "glowing crystal"
  },
  {
    id: 't3',
    userName: 'Saylor Moon 🌙',
    userHandle: 'MichaelSaylorFan',
    avatarUrl: 'https://placehold.co/48x48.png?text=SM',
    content: '$PEPE está mostrando força! Se romper a resistência, pode explodir. De olho no volume da Axiom Trade. #PepeCoin #FrogNation 🐸 #NotFinancialAdvice',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    likes: 5300,
    retweets: 1200,
    replies: 300,
    coinTags: ['PEPE', 'AxiomTrade'],
    dataAiHint: "frog astronaut"
  },
];

const moreMockTweets: MockTweet[] = [
    {
    id: 't4',
    userName: 'Vitalik Buterin (Fan)',
    userHandle: 'VitalikFanClub',
    avatarUrl: 'https://placehold.co/48x48.png?text=VB',
    content: 'Interessante como o ecossistema $BONK na Solana está evoluindo. A comunidade é a chave para memecoins. #BONK #Solana',
    timestamp: new Date().toISOString(),
    likes: 980,
    retweets: 210,
    replies: 55,
    coinTags: ['BONK', 'Solana'],
    dataAiHint: "dog computer"
  },
  {
    id: 't5',
    userName: 'CZ Binance (Commentary)',
    userHandle: 'CZCommentary',
    avatarUrl: 'https://placehold.co/48x48.png?text=CZ',
    content: "A volatilidade das memecoins como $WIF é incrível. Lembrem-se: invistam apenas o que podem perder. Mas a diversão é garantida! 🎩 #DogWifHat #WIF #CryptoTrading",
    timestamp: new Date().toISOString(),
    likes: 3200,
    retweets: 800,
    replies: 150,
    imageUrl: 'https://placehold.co/600x350.png',
    coinTags: ['WIF'],
    dataAiHint: "dog hat chart"
  },
  {
    id: 't6',
    userName: 'AxiomAlpha',
    userHandle: 'AxiomTraderPro',
    avatarUrl: 'https://placehold.co/48x48.png?text=AA',
    content: "Notando picos de volume incomuns para $FLOKI na Axiom Trade. Algo pode estar se formando. DYOR, mas pode ser uma configuração interessante. #FLOKI #TradingSignal",
    timestamp: new Date().toISOString(),
    likes: 750,
    retweets: 150,
    replies: 40,
    coinTags: ['FLOKI', 'AxiomTrade'],
    dataAiHint: "viking dog"
  },
   {
    id: 't7',
    userName: 'Cointelegraph Markets',
    userHandle: 'Cointelegraph',
    avatarUrl: 'https://placehold.co/48x48.png?text=CT',
    content: "Principais memecoins em alta hoje: $PEPE, $WIF, $DOGE. Os clássicos ainda estão com força total! Qual delas é sua maior aposta? #Crypto #Altcoins",
    timestamp: new Date().toISOString(),
    likes: 1500,
    retweets: 400,
    replies: 90,
    coinTags: ['PEPE', 'WIF', 'DOGE'],
    dataAiHint: "coins rocket"
  },
];


const MAX_TWEETS_DISPLAYED = 20;

export default function TwitterFeedPage() {
  const [tweets, setTweets] = useState<MockTweet[]>(initialMockTweets);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const fetchNewTweet = useCallback(() => {
    if (isPaused) return;

    const newTweetIndex = Math.floor(Math.random() * moreMockTweets.length);
    const newTweetTemplate = moreMockTweets[newTweetIndex];
    const newTweet: MockTweet = {
      ...newTweetTemplate,
      id: `t${Date.now()}${Math.random()}`, // Unique ID
      timestamp: new Date().toISOString(),
      likes: Math.floor(Math.random() * 5000) + 50, // Random likes
      retweets: Math.floor(Math.random() * 1000) + 10,
      replies: Math.floor(Math.random() * 200) + 5,
    };

    setTweets(prevTweets => {
      const updatedTweets = [newTweet, ...prevTweets];
      if (updatedTweets.length > MAX_TWEETS_DISPLAYED) {
        return updatedTweets.slice(0, MAX_TWEETS_DISPLAYED);
      }
      return updatedTweets;
    });
  }, [isPaused]);

  useEffect(() => {
    // Adicionar data-ai-hint aos tweets iniciais que não têm
    setTweets(prevTweets => prevTweets.map(t => ({
      ...t,
      dataAiHint: t.dataAiHint || 'crypto meme' // Default hint
    })));

    // Adicionar data-ai-hint aos tweets que podem ser adicionados dinamicamente
    moreMockTweets.forEach(tweet => {
      if (!tweet.dataAiHint) {
        tweet.dataAiHint = 'crypto meme'; // Default hint
      }
    });


    setIsLoading(false); // Simulate initial load
    const intervalId = setInterval(fetchNewTweet, 7000); // Add a new tweet every 7 seconds
    return () => clearInterval(intervalId);
  }, [fetchNewTweet]);

  const togglePause = () => setIsPaused(!isPaused);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Rss className="mr-3 h-8 w-8 text-primary" />
          Feed de MemeCoins (Em Tempo Real)
        </h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full p-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Rss className="mr-3 h-8 w-8 text-primary" />
          Feed de MemeCoins (Simulado em Tempo Real)
        </h1>
        <Button onClick={togglePause} variant="outline" size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${!isPaused ? 'animate-spin-slow' : ''}`} />
          {isPaused ? 'Retomar Atualizações' : 'Pausar Atualizações'}
        </Button>
      </div>

      {tweets.length > 0 ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          {tweets.map((tweet) => (
            <TweetDisplayCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-headline text-foreground mb-2">Nenhum Tweet Recente</h2>
          <p className="text-muted-foreground">O feed está buscando novas atualizações. Posts sobre meme coins aparecerão aqui em breve!</p>
        </div>
      )}
       <style jsx global>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
