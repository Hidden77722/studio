
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp, TrendingDown, BarChartHorizontalBig } from "lucide-react";
import type { CoinMarketData } from "@/lib/types"; // Assuming this type exists and is suitable
import Image from "next/image";

// Mock data simulating "Most Viewed" coins, as if from CoinMarketCap
const mockMostViewedCoins: CoinMarketData[] = [
  {
    id: "bitcoin-mv",
    symbol: "BTC",
    name: "Bitcoin (Simulado)",
    image: "https://placehold.co/40x40.png?text=BTC",
    current_price: 60500.75,
    market_cap: 1200000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 1.5,
    total_volume: 50000000000,
  },
  {
    id: "ethereum-mv",
    symbol: "ETH",
    name: "Ethereum (Simulado)",
    image: "https://placehold.co/40x40.png?text=ETH",
    current_price: 3020.10,
    market_cap: 360000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -0.5,
    total_volume: 25000000000,
  },
  {
    id: "super-meme-mv",
    symbol: "SMEME",
    name: "SuperMeme Coin (Simulado)",
    image: "https://placehold.co/40x40.png?text=SM",
    current_price: 0.000123,
    market_cap: 12300000,
    market_cap_rank: 300,
    price_change_percentage_24h: 45.7,
    total_volume: 5000000,
  },
  {
    id: "hype-token-mv",
    symbol: "HYPE",
    name: "HypeToken (Simulado)",
    image: "https://placehold.co/40x40.png?text=HP",
    current_price: 0.025,
    market_cap: 25000000,
    market_cap_rank: 250,
    price_change_percentage_24h: 15.2,
    total_volume: 2000000,
  },
  {
    id: "solana-viewed",
    symbol: "SOL",
    name: "Solana (Simulado)",
    image: "https://placehold.co/40x40.png?text=SOL",
    current_price: 150.55,
    market_cap: 70000000000,
    market_cap_rank: 5,
    price_change_percentage_24h: 5.8,
    total_volume: 3000000000,
  },
];

export default function MostViewedPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Eye className="mr-3 h-8 w-8 text-primary" />
          Moedas Mais Vistas (Simulação)
        </h1>
        <p className="text-sm text-muted-foreground mt-2 sm:mt-0 max-w-md">
          Lista simulada de moedas com alta visualização, servindo como um proxy para tendências e hype do mercado.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockMostViewedCoins.map((coin) => (
          <Card key={coin.id} className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300 ease-in-out">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={coin.image}
                    alt={`${coin.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-full"
                    data-ai-hint={`${coin.symbol.toLowerCase()} logo`}
                  />
                  <div>
                    <CardTitle className="text-lg font-headline leading-tight">{coin.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground uppercase">{coin.symbol}</CardDescription>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">#{coin.market_cap_rank}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: coin.current_price < 1 ? 8 : 2 })}
              </div>
              <div className={`flex items-center text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {coin.price_change_percentage_24h.toFixed(2)}% <span className="text-muted-foreground text-xs ml-1">(24h)</span>
              </div>
               <div className="text-xs text-muted-foreground pt-1">
                  <BarChartHorizontalBig className="inline-block mr-1.5 h-3 w-3" />
                  Vol (24h): ${coin.total_volume.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Nota sobre os Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
                Os dados exibidos nesta página são <strong>simulados</strong> para fins de demonstração.
            </p>
            <p>
                Em uma aplicação real, esta seção seria alimentada por uma API como a da CoinMarketCap (para "Most Viewed"),
                DexScreener, ou outra fonte de dados de tendências de mercado. A integração com tais APIs geralmente
                requer gerenciamento de chaves de API e chamadas de backend para segurança e eficiência.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
