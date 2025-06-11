
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { analyzeMarketSentiment, type MarketSentimentInput, type MarketSentimentOutput } from "@/ai/flows/market-sentiment-flow";
import { Loader2, BotMessageSquare, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function MarketSentimentExamplePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentimentResult, setSentimentResult] = useState<MarketSentimentOutput | null>(null);

  const [coinName, setCoinName] = useState("MegaPump Coin (MEGA)");
  const [description, setDescription] = useState("Nova meme coin com tema de foguete, comunidade pequena mas ativa no Telegram, prometendo 'queimas semanais'. Listada recentemente na Raydium.");
  const [volume24h, setVolume24h] = useState("50000"); // String to handle input, convert to number on submit
  const [priceChange24h, setPriceChange24h] = useState("150"); // String for input

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSentimentResult(null);

    const vol = parseFloat(volume24h);
    const priceChange = parseFloat(priceChange24h);

    if (isNaN(vol) || isNaN(priceChange)) {
      setError("Volume e Variação de Preço devem ser números válidos.");
      setIsLoading(false);
      return;
    }

    try {
      const input: MarketSentimentInput = {
        coinName,
        description,
        volume24h: vol,
        priceChange24h: priceChange,
      };
      const result = await analyzeMarketSentiment(input);
      setSentimentResult(result);
    } catch (e) {
      console.error("Error fetching AI sentiment analysis:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocorreu um erro desconhecido.";
      setError(`Falha ao gerar a análise de sentimento da IA: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeVariant = (potential: MarketSentimentOutput['hypePotential'] | undefined) => {
    if (!potential) return "secondary";
    switch (potential) {
      case "Alta":
        return "default"; // Uses primary color, usually vibrant
      case "Moderada":
        return "secondary"; // Uses secondary color
      case "Baixa":
        return "outline"; // More subdued
      default:
        return "secondary";
    }
  };
   const getBadgeClasses = (potential: MarketSentimentOutput['hypePotential'] | undefined) => {
    if (!potential) return "";
    switch (potential) {
      case "Alta":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Moderada":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Baixa":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "";
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BotMessageSquare className="mr-3 h-8 w-8 text-primary" />
          Análise de Sentimento de Mercado com IA
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Teste o Potencial de Hype com IA</CardTitle>
          <CardDescription>
            Insira dados fictícios de uma moeda para ver como nossa IA classifica seu potencial de hype e fornece uma justificativa.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="coinName">Nome da Moeda</Label>
              <Input
                id="coinName"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                placeholder="ex: PepeInu (PEPEI)"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição/Contexto da Moeda</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Insira uma breve descrição, narrativas, comunidade..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="volume24h">Volume (24h USD)</Label>
              <Input
                id="volume24h"
                type="number"
                value={volume24h}
                onChange={(e) => setVolume24h(e.target.value)}
                placeholder="ex: 1500000"
              />
            </div>
            <div>
              <Label htmlFor="priceChange24h">Variação de Preço (24h %)</Label>
              <Input
                id="priceChange24h"
                type="number"
                value={priceChange24h}
                onChange={(e) => setPriceChange24h(e.target.value)}
                placeholder="ex: 25.5 (para +25.5%)"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <BotMessageSquare className="mr-2 h-5 w-5" />
              )}
              Analisar Potencial de Hype
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-2 p-8 bg-card rounded-lg shadow-md mt-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Analisando sentimento...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro na Análise</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {sentimentResult && !isLoading && (
        <Card className="max-w-2xl mx-auto shadow-xl mt-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Resultado da Análise de Sentimento para {coinName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-muted-foreground">Potencial de Hype:</p>
              <Badge variant={getBadgeVariant(sentimentResult.hypePotential)} className={getBadgeClasses(sentimentResult.hypePotential)}>
                {sentimentResult.hypePotential}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Justificativa da IA:</p>
              <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{sentimentResult.justification}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
