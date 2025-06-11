
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { generateTradeCall, type GenerateTradeCallInput, type GeneratedTradeCallOutput } from "@/ai/flows/generate-trade-call-flow";
import { Loader2, Wand2, AlertTriangle, FileJson } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function GenerateTradeCallPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tradeCallResult, setTradeCallResult] = useState<GeneratedTradeCallOutput | null>(null);

  const [coinName, setCoinName] = useState("DOGEMOON");
  const [volume24h, setVolume24h] = useState("250000");
  const [liquidity, setLiquidity] = useState("75000");
  const [currentPrice, setCurrentPrice] = useState("0.00000421");
  const [priceChange1h, setPriceChange1h] = useState("5.2");
  const [priceChange24h, setPriceChange24h] = useState("35.7");
  const [isOnHotList, setIsOnHotList] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTradeCallResult(null);

    const numVolume24h = parseFloat(volume24h);
    const numLiquidity = parseFloat(liquidity);
    const numCurrentPrice = parseFloat(currentPrice);
    const numPriceChange1h = parseFloat(priceChange1h);
    const numPriceChange24h = parseFloat(priceChange24h);

    if (isNaN(numVolume24h) || isNaN(numLiquidity) || isNaN(numCurrentPrice) || isNaN(numPriceChange1h) || isNaN(numPriceChange24h)) {
      setError("Todos os campos numéricos devem ser válidos.");
      setIsLoading(false);
      return;
    }

    try {
      const input: GenerateTradeCallInput = {
        coinName,
        volume24h: numVolume24h,
        liquidity: numLiquidity,
        currentPrice: numCurrentPrice,
        priceChange1h: numPriceChange1h,
        priceChange24h: numPriceChange24h,
        isOnHotList,
      };
      const result = await generateTradeCall(input);
      setTradeCallResult(result);
    } catch (e) {
      console.error("Error generating AI trade call:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocorreu um erro desconhecido.";
      setError(`Falha ao gerar a call de trade com IA: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Wand2 className="mr-3 h-8 w-8 text-primary" />
          Gerador de Call de Trade com IA
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Gerar Call de Trade</CardTitle>
          <CardDescription>
            Insira os dados de mercado de uma moeda para que a IA gere uma sugestão de call de trade.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="coinName">Nome da Moeda (ex: DOGEMOON)</Label>
              <Input id="coinName" value={coinName} onChange={(e) => setCoinName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volume24h">Volume (24h USD)</Label>
                <Input id="volume24h" type="number" value={volume24h} onChange={(e) => setVolume24h(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="liquidity">Liquidez (USD)</Label>
                <Input id="liquidity" type="number" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentPrice">Preço Atual (USD)</Label>
                <Input id="currentPrice" type="number" step="any" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} />
              </div>
               <div>
                <Label htmlFor="priceChange1h">Variação Preço (1h %)</Label>
                <Input id="priceChange1h" type="number" step="any" value={priceChange1h} onChange={(e) => setPriceChange1h(e.target.value)} />
              </div>
            </div>
             <div>
                <Label htmlFor="priceChange24h">Variação Preço (24h %)</Label>
                <Input id="priceChange24h" type="number" step="any" value={priceChange24h} onChange={(e) => setPriceChange24h(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="isOnHotList" checked={isOnHotList} onCheckedChange={setIsOnHotList} />
              <Label htmlFor="isOnHotList">Está em Lista "Hot/Trending"?</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
              Gerar Call
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-2 p-8 bg-card rounded-lg shadow-md mt-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Gerando call de trade...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro na Geração</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {tradeCallResult && !isLoading && (
        <Card className="max-w-2xl mx-auto shadow-xl mt-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
              <FileJson className="mr-2 h-5 w-5 text-primary" />
              Call Gerada para {tradeCallResult.moeda}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 bg-muted/30 p-4 rounded-md">
            <div className="text-sm font-mono whitespace-pre-wrap">
              {JSON.stringify(tradeCallResult, null, 2)}
            </div>
            <hr className="my-2 border-border"/>
            <h4 className="font-semibold text-md">Detalhes da Call:</h4>
            <p><strong>Moeda:</strong> {tradeCallResult.moeda}</p>
            <p><strong>Hora da Call:</strong> {tradeCallResult.hora_call}</p>
            <p><strong>Entrada:</strong> <span className="font-semibold text-green-400">{tradeCallResult.entrada}</span></p>
            <p><strong>Alvo:</strong> <span className="font-semibold text-green-400">{tradeCallResult.alvo}</span></p>
            <p><strong>Stop:</strong> <span className="font-semibold text-red-400">{tradeCallResult.stop}</span></p>
            <p><strong>Motivo:</strong> {tradeCallResult.motivo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
