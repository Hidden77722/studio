
"use client";

import React from "react";
import type { HotPair } from "@/lib/types";
import { HotPairCard } from "@/app/dashboard/components/HotPairCard";
import { Flame, AlertTriangle } from "lucide-react";

const mockHotPairs: HotPair[] = [
  {
    id: "hp1",
    name: "TurboCat",
    symbol: "TCAT",
    pairAddress: "0x123abcPairAddressForTurboCat",
    exchange: "Uniswap v2",
    reason: "Aumento explosivo de volume (500%+) e liquidez nas últimas 2 horas. Viral no Twitter.",
    mockVolume24h: 2500000,
    mockLiquidity: 750000,
    priceChange24h: 125.5,
    logoUrl: "https://placehold.co/40x40.png?text=TC",
    logoAiHint: "cat turbo",
    dexScreenerUrl: "https://dexscreener.com/ethereum/0x123abcPairAddressForTurboCat" 
  },
  {
    id: "hp2",
    name: "SolanaSurge",
    symbol: "SSURGE",
    pairAddress: "0x456defPairAddressForSolanaSurge",
    exchange: "Raydium",
    reason: "Nova listagem em DEX com rápida adição de liquidez. Mencionada por grande influenciador Solana.",
    mockVolume24h: 1800000,
    mockLiquidity: 400000,
    priceChange24h: 78.2,
    logoUrl: "https://placehold.co/40x40.png?text=SS",
    logoAiHint: "solana wave",
    dexScreenerUrl: "https://dexscreener.com/solana/0x456defPairAddressForSolanaSurge"
  },
  {
    id: "hp3",
    name: "BasedAI",
    symbol: "BAI",
    pairAddress: "0x789ghiPairAddressForBasedAI",
    exchange: "Sushiswap",
    reason: "Narrativa de IA + Base Chain. Forte engajamento comunitário e aumento de detentores.",
    mockVolume24h: 950000,
    mockLiquidity: 220000,
    priceChange24h: 45.0,
    logoUrl: "https://placehold.co/40x40.png?text=AI",
    logoAiHint: "brain ai",
    dexScreenerUrl: "https://dexscreener.com/base/0x789ghiPairAddressForBasedAI"
  },
   {
    id: "hp4",
    name: "PepeClassic",
    symbol: "PEPEC",
    pairAddress: "0xabc123PairAddressForPepeClassic",
    exchange: "PancakeSwap",
    reason: "Ressurgimento de interesse em memes clássicos, volume em alta.",
    mockVolume24h: 1200000,
    mockLiquidity: 300000,
    priceChange24h: -5.2, // Example of negative change
    logoUrl: "https://placehold.co/40x40.png?text=PC",
    logoAiHint: "classic pepe",
    dexScreenerUrl: "https://dexscreener.com/bsc/0xabc123PairAddressForPepeClassic"
  }
];

export default function HotPairsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Flame className="mr-3 h-8 w-8 text-primary" />
          Pares em Alta (DexScreener Simulado)
        </h1>
        <p className="text-sm text-muted-foreground mt-2 sm:mt-0 max-w-md">
          Moedas com alto volume, liquidez e hype recente. (Dados simulados)
        </p>
      </div>

      {mockHotPairs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {mockHotPairs.map((pair) => (
            <HotPairCard key={pair.id} pair={pair} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <AlertTriangle className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-xl font-headline text-foreground mb-2">Nenhum Par em Alta Encontrado</h2>
          <p className="text-muted-foreground text-center">
            No momento, não há pares em alta simulados para exibir. Verifique mais tarde ou ajuste os critérios de simulação.
          </p>
        </div>
      )}
    </div>
  );
}
