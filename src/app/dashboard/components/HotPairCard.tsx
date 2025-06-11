
"use client";

import type { HotPair } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Droplets, ExternalLink, Flame, TrendingUp, BarChart2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HotPairCardProps {
  pair: HotPair;
}

export function HotPairCard({ pair }: HotPairCardProps) {
  return (
    <Card className="w-full shadow-lg hover:shadow-primary/20 transition-shadow duration-300 ease-in-out flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {pair.logoUrl ? (
              <Image
                src={pair.logoUrl}
                alt={`${pair.name} logo`}
                width={32}
                height={32}
                className="rounded-full"
                data-ai-hint={pair.logoAiHint || "coin logo"}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary font-bold text-sm">
                {pair.symbol.substring(0, 2)}
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-headline leading-tight">{pair.name} ({pair.symbol})</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {pair.exchange}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            <Flame className="mr-1 h-3.5 w-3.5" /> Em Alta
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-0.5">Motivo do Destaque:</h4>
          <p className="text-sm">{pair.reason}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm pt-2">
          <div className="p-2.5 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground flex items-center">
              <BarChart2 className="h-3 w-3 mr-1" /> Volume (24h)
            </p>
            <p className="font-semibold text-base">${pair.mockVolume24h.toLocaleString()}</p>
          </div>
          <div className="p-2.5 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground flex items-center">
              <Droplets className="h-3 w-3 mr-1" /> Liquidez
            </p>
            <p className="font-semibold text-base">${pair.mockLiquidity.toLocaleString()}</p>
          </div>
        </div>
        {pair.priceChange24h !== undefined && (
            <div className={`p-2.5 bg-muted/50 rounded-md text-sm ${pair.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <p className="text-xs text-muted-foreground">Preço (24h)</p>
                <p className="font-semibold text-base flex items-center">
                    <TrendingUp className={`h-4 w-4 mr-1 ${pair.priceChange24h < 0 ? 'transform rotate-180' : ''}`} />
                    {pair.priceChange24h.toFixed(2)}%
                </p>
            </div>
        )}
      </CardContent>
      <CardFooter>
        {pair.dexScreenerUrl ? (
          <Button asChild variant="outline" size="sm" className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary">
            <Link href={pair.dexScreenerUrl} target="_blank" rel="noopener noreferrer">
              Ver no DexScreener <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
            <Button variant="outline" size="sm" className="w-full" disabled>
                Link DexScreener Indisponível
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
