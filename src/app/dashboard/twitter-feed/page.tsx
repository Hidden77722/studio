
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { MockTweet } from '@/lib/types';
import { TweetDisplayCard } from '@/app/dashboard/components/TweetDisplayCard';
import { Rss, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const initialMockTweets: MockTweet[] = [
  {
    id: 't1',
    userName: 'CryptoWhaleGems',
    userHandle: 'CryptoWhale',
    avatarUrl: 'https://placehold.co/48x48.png?text=CW',
    content: '$DOGE is showing strong support at $0.15. A breakout above $0.17 could send it flying! #Dogecoin #ToTheMoon 🚀\nChart looks bullish on Axiom Trade.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    likes: 1250,
    retweets: 340,
    replies: 75,
    imageUrl: 'https://placehold.co/600x400.png',
    coinTags: ['DOGE', 'AxiomTrade'],
  },
  {
    id: 't2',
    userName: 'MemeCoinMaster',
    userHandle: 'MemeLord',
    avatarUrl: 'https://placehold.co/48x48.png?text=ML',
    content: 'Just scooped up a bag of $SHIB. The Shibarium ecosystem is growing fast. Potential for 10x this bull run? 🤔 #SHIB #MemeCoin',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 minutes ago
    likes: 2100,
    retweets: 550,
    replies: 120,
    coinTags: ['SHIB'],
  },
  {
    id: 't3',
    userName: 'PepePumpKing',
    userHandle: 'RealPepeMaxi',
    avatarUrl: 'https://placehold.co/48x48.png?text=PP',
    content: "$PEPE army, are you ready? Rumors of a major CEX listing next week! Don't miss out. Volume on Axiom Trade is picking up. #PepeCoin #FrogNation 🐸",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    likes: 5300,
    retweets: 1200,
    replies: 300,
    coinTags: ['PEPE', 'AxiomTrade'],
  },
];

const moreMockTweets: MockTweet[] = [
    {
    id: 't4',
    userName: 'BonkHunter',
    userHandle: 'BonkFiend',
    avatarUrl: 'https://placehold.co/48x48.png?text=BH',
    content: '$BONK is consolidating nicely after the recent pump. Watching for a breakout above the current resistance. Solana meme season is far from over! #BONK #Solana',
    timestamp: new Date().toISOString(),
    likes: 980,
    retweets: 210,
    replies: 55,
    coinTags: ['BONK', 'Solana'],
  },
  {
    id: 't5',
    userName: 'WIFWatcher',
    userHandle: 'DogWifHatFan',
    avatarUrl: 'https://placehold.co/48x48.png?text=WF',
    content: "Can't get enough of $WIF! This community is insane. Hat stays ON. 🎩 $WIF to $10 soon? #DogWifHat #WIF",
    timestamp: new Date().toISOString(),
    likes: 3200,
    retweets: 800,
    replies: 150,
    imageUrl: 'https://placehold.co/600x350.png',
    coinTags: ['WIF'],
  },
  {
    id: 't6',
    userName: 'AxiomAlpha',
    userHandle: 'AxiomTraderPro',
    avatarUrl: 'https://placehold.co/48x48.png?text=AA',
    content: "Noticing unusual volume spikes for $FLOKI on Axiom Trade. Something might be brewing. DYOR but could be an interesting setup. #FLOKI #TradingSignal",
    timestamp: new Date().toISOString(),
    likes: 750,
    retweets: 150,
    replies: 40,
    coinTags: ['FLOKI', 'AxiomTrade'],
  },
   {
    id: 't7',
    userName: 'MemeCoinDaily',
    userHandle: 'DailyMemes',
    avatarUrl: 'https://placehold.co/48x48.png?text=MD',
    content: "Top trending meme coins today: $PEPE, $WIF, $DOGE. The classics are still running hard! Which one is your biggest bag? #Crypto #Altcoins",
    timestamp: new Date().toISOString(),
    likes: 1500,
    retweets: 400,
    replies: 90,
    coinTags: ['PEPE', 'WIF', 'DOGE'],
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

