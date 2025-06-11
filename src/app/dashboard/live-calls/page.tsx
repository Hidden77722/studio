
"use client";
import { CallCard } from "@/app/dashboard/components/CallCard";
import type { MemeCoinCall } from "@/lib/types";
import React, { useState, useEffect, useCallback } from 'react';

const REAL_COIN_POOL = [
  { coingeckoId: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', imageUrl: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', logoAiHint: 'dogecoin logo' },
  { coingeckoId: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB', imageUrl: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', logoAiHint: 'shiba inu' },
  { coingeckoId: 'pepe', name: 'Pepe', symbol: 'PEPE', imageUrl: 'https://assets.coingecko.com/coins/images/29850/large/pepe.jpeg', logoAiHint: 'pepe frog' },
  { coingeckoId: 'bonk', name: 'Bonk', symbol: 'BONK', imageUrl: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg', logoAiHint: 'bonk dog' },
  { coingeckoId: 'dogwifhat', name: 'dogwifhat', symbol: 'WIF', imageUrl: 'https://assets.coingecko.com/coins/images/33566/large/dogwifhat.jpg', logoAiHint: 'dog wif hat' },
  { coingeckoId: 'floki', name: 'FLOKI', symbol: 'FLOKI', imageUrl: 'https://assets.coingecko.com/coins/images/16746/large/floki-inu.png', logoAiHint: 'floki inu' }
];

const ALERT_TEMPLATES = [
  {
    idBase: "template1",
    reason: "Pump massivo coordenado no Twitter e Reddit, indicadores técnicos confirmando rompimento. Volume na Axiom Trade subindo.",
    targetsConfig: [{ multiplier: 1.5, percentageFormat: "+50%" }, { multiplier: 2.0, percentageFormat: "+100%" }],
    stopLossConfig: { multiplier: 0.85 }, // Stop at 15% loss
    technicalAnalysisSummary: "Acaba de romper uma cunha descendente com volume 5x acima da média. RSI no gráfico de 1H está em 70. Próxima resistência significativa distante.",
    marketSentimentSummary: "Campanha #ToTheMoon viralizando no Twitter. Posts em r/MemeCoinMoonshots explodindo. Sentimento de FOMO. Grande volume na Axiom Trade.",
  },
  {
    idBase: "template2",
    reason: "Anúncio de parceria com grande influenciador e listagem iminente em corretora. Gráfico mostra acumulação. Comentários positivos sobre Axiom Trade.",
    targetsConfig: [{ multiplier: 1.8, percentageFormat: "+80%" }, { multiplier: 2.5, percentageFormat: "+150%" }],
    stopLossConfig: { multiplier: 0.9 }, // Stop at 10% loss
    technicalAnalysisSummary: "Formou um padrão 'copo e alça' no gráfico de 4H. Volume de acumulação tem aumentado. Suporte forte na média móvel de 50 períodos.",
    marketSentimentSummary: "Influenciador 'CryptoGuru' (10M seguidores) postou sobre a moeda. Rumores de listagem na 'MemeXchange'. Comunidade no Discord e Telegram engajada.",
  },
  {
    idBase: "template3",
    reason: "Nova narrativa 'Killer 2.0' ganhando tração no Reddit. Análise de contrato indica baixo risco. Volume na Axiom Trade começando a subir.",
    targetsConfig: [{ multiplier: 2.0, percentageFormat: "+100%" }, { multiplier: 3.0, percentageFormat: "+200%" }],
    stopLossConfig: { multiplier: 0.8 }, // Stop at 20% loss
    technicalAnalysisSummary: "Formando um fundo arredondado no gráfico de 15min, com divergência bullish no MACD. Rompimento da neckline pode levar a uma rápida valorização.",
    marketSentimentSummary: "Thread viral em r/SatoshiStreetBets. Diversos tweets de contas de 'crypto gems' mencionando. Sentimento extremamente positivo. Axiom Trade com volume crescente.",
  }
];

const NUMBER_OF_VISIBLE_CARDS = 3;

async function fetchCoinCurrentPrice(coinId: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
    if (!response.ok) {
      console.error(`Falha ao buscar preço para ${coinId} da CoinGecko: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    const price = data[coinId]?.usd;
    if (typeof price !== 'number') {
        console.error(`Preço inválido recebido para ${coinId} da CoinGecko:`, price);
        return null;
    }
    return price;
  } catch (error) {
    console.error(`Erro ao buscar preço para ${coinId} da CoinGecko:`, error);
    return null;
  }
}

export default function LiveCallsPage() {
  const [liveCalls, setLiveCalls] = useState<MemeCoinCall[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const generateNewCall = useCallback(async (): Promise<MemeCoinCall | null> => {
    const randomTemplate = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
    const randomCoinInfo = REAL_COIN_POOL[Math.floor(Math.random() * REAL_COIN_POOL.length)];

    const currentPrice = await fetchCoinCurrentPrice(randomCoinInfo.coingeckoId);
    if (currentPrice === null) return null; // Failed to fetch price

    const entryPrice = currentPrice;
    const targets = randomTemplate.targetsConfig.map(t => ({
      price: entryPrice * t.multiplier,
      percentage: t.percentageFormat,
    }));
    const stopLoss = entryPrice * randomTemplate.stopLossConfig.multiplier;
    const now = new Date();

    return {
      id: `${randomTemplate.idBase}-${randomCoinInfo.coingeckoId}-${now.getTime()}`,
      coinName: randomCoinInfo.name,
      coinSymbol: randomCoinInfo.symbol,
      logoUrl: randomCoinInfo.imageUrl,
      logoAiHint: randomCoinInfo.logoAiHint,
      entryTime: now.toISOString(),
      reason: `[${now.toLocaleTimeString('pt-BR')}] ${randomTemplate.reason}`,
      entryPrice,
      targets,
      stopLoss,
      technicalAnalysisSummary: randomTemplate.technicalAnalysisSummary,
      marketSentimentSummary: randomTemplate.marketSentimentSummary,
    };
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialCalls = async () => {
      setIsLoadingInitial(true);
      const initialCallsPromises = Array(NUMBER_OF_VISIBLE_CARDS).fill(null).map(() => generateNewCall());
      const resolvedInitialCalls = (await Promise.all(initialCallsPromises)).filter(call => call !== null) as MemeCoinCall[];
      setLiveCalls(resolvedInitialCalls);
      setIsLoadingInitial(false);
    };
    loadInitialCalls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // generateNewCall is memoized

  useEffect(() => {
    if (isLoadingInitial) return; // Don't start interval if initial calls are still loading

    const intervalId = setInterval(async () => {
      const newCall = await generateNewCall();
      if (newCall) {
        setLiveCalls(prevCalls => {
          const calls = [...prevCalls];
          if (calls.length >= NUMBER_OF_VISIBLE_CARDS) {
            calls.shift(); // Remove the oldest call
          }
          calls.push(newCall); // Add the new call
          return calls;
        });
      }
    }, 7000); // Generate a new call every 7 seconds, replacing an old one

    return () => clearInterval(intervalId);
  }, [isLoadingInitial, generateNewCall]);

  if (isLoadingInitial) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-headline font-semibold">Alertas de Trade Ativos</h1>
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-circle animate-spin text-primary mb-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Carregando Alertas Iniciais...</h2>
          <p className="text-muted-foreground text-center">Buscando os dados mais recentes do mercado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Alertas de Trade Ativos</h1>
      {liveCalls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {liveCalls.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope text-primary mb-4"><path d="m12 21-1.2-3.6a1 1 0 0 1 1-1.2L18 15l3-3-6-1.8a1 1 0 0 1-1.2-1L9 3 6 6l1.8 6a1 1 0 0 1-1 1.2L3 15"/><circle cx="12" cy="12" r="2"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Nenhum Alerta Ativo</h2>
          <p className="text-muted-foreground text-center">Nossos analistas estão monitorando os mercados. Novos alertas aparecerão aqui em breve!</p>
        </div>
      )}
    </div>
  );
}
