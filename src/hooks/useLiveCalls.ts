
"use client";

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

const NUMBER_OF_CALLS_MANAGED_BY_HOOK = 3;
const MAX_FETCH_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second

async function fetchCoinCurrentPrice(coinId: string): Promise<number | null> {
  let attempts = 0;
  while (attempts < MAX_FETCH_RETRIES) {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      if (!response.ok) {
        const statusText = response.statusText || 'Unknown error';
        console.warn(`Falha na requisição de preço para ${coinId} da CoinGecko (tentativa ${attempts + 1}/${MAX_FETCH_RETRIES}): ${response.status} ${statusText}`);
        if (response.status === 429) { // Rate limit
            attempts++;
            if (attempts < MAX_FETCH_RETRIES) {
                const delay = RETRY_DELAY_MS * Math.pow(2, attempts -1); // Exponential backoff
                console.warn(`Rate limit (429) para ${coinId}. Tentando novamente em ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                 console.warn(`Rate limit (429) para ${coinId} após ${MAX_FETCH_RETRIES} tentativas. Desistindo.`);
                 return null;
            }
            continue;
        }
        // For other non-OK responses, don't retry indefinitely, fail after first attempt if not a rate limit
        return null;
      }
      const data = await response.json();

      if (!data || typeof data[coinId] === 'undefined') {
        console.warn(`Dados para ${coinId} não encontrados na resposta da CoinGecko (tentativa ${attempts + 1}/${MAX_FETCH_RETRIES}). Resposta:`, data);
        return null;
      }

      const coinData = data[coinId];
      const price = coinData.usd;

      if (typeof price !== 'number') {
        console.warn(`Preço USD para ${coinId} está ausente ou não é um número (tentativa ${attempts + 1}/${MAX_FETCH_RETRIES}). Dados recebidos para a moeda:`, coinData);
        return null;
      }
      return price;
    } catch (error) {
      attempts++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (attempts < MAX_FETCH_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempts -1); // Exponential backoff
        console.warn(`Falha de rede ao buscar preço para ${coinId} (tentativa ${attempts}/${MAX_FETCH_RETRIES}): ${errorMessage}. Tentando novamente em ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.warn(`Falha de rede ao buscar preço para ${coinId} após ${MAX_FETCH_RETRIES} tentativas: ${errorMessage}. Verifique sua conexão ou o status da API CoinGecko.`);
        return null; // Final failure
      }
    }
  }
  console.warn(`[SAFGUARD] Saindo de fetchCoinCurrentPrice para ${coinId} sem retornar um valor após ${MAX_FETCH_RETRIES} tentativas.`);
  return null;
}

export function useLiveCalls() {
  const [liveCalls, setLiveCalls] = useState<MemeCoinCall[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const generateNewCall = useCallback(async (): Promise<MemeCoinCall | null> => {
    const randomTemplate = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
    const randomCoinInfo = REAL_COIN_POOL[Math.floor(Math.random() * REAL_COIN_POOL.length)];

    const currentPrice = await fetchCoinCurrentPrice(randomCoinInfo.coingeckoId);
    if (currentPrice === null) return null;

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

  useEffect(() => {
    const loadInitialCalls = async () => {
      console.log("Iniciando carregamento de alertas ao vivo (useLiveCalls)...");
      setIsLoadingInitial(true);
      const newLiveCalls: MemeCoinCall[] = [];
      let generationAttempts = 0;
      const maxGenerationAttempts = NUMBER_OF_CALLS_MANAGED_BY_HOOK * (MAX_FETCH_RETRIES + 2); // Increased attempts margin

      while(newLiveCalls.length < NUMBER_OF_CALLS_MANAGED_BY_HOOK && generationAttempts < maxGenerationAttempts) {
        const call = await generateNewCall();
        if (call) {
          // Avoid duplicate coin symbols in initial load if possible
          if (!newLiveCalls.some(existingCall => existingCall.coinSymbol === call.coinSymbol)) {
             newLiveCalls.push(call);
          } else {
            // If coin already exists, try generating for a different one to fill slots faster
            generationAttempts++; // Count this as an attempt
            continue;
          }
        } else {
          // If call generation failed (e.g., price fetch failed), add a small delay before retrying
          if (newLiveCalls.length < NUMBER_OF_CALLS_MANAGED_BY_HOOK) {
             await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS / 2));
          }
        }
        generationAttempts++;
      }
      setLiveCalls(newLiveCalls);
      setIsLoadingInitial(false);
      if (newLiveCalls.length === 0 && generationAttempts >= maxGenerationAttempts) {
        console.warn("Não foi possível carregar nenhum alerta inicial (useLiveCalls) após várias tentativas. Verifique a conexão e o status da API CoinGecko.");
      } else if (newLiveCalls.length < NUMBER_OF_CALLS_MANAGED_BY_HOOK) {
        console.warn(`Carregados ${newLiveCalls.length}/${NUMBER_OF_CALLS_MANAGED_BY_HOOK} alertas iniciais (useLiveCalls).`);
      } else {
        console.log(`${newLiveCalls.length} alertas iniciais carregados com sucesso (useLiveCalls).`);
      }
    };
    loadInitialCalls();
  }, [generateNewCall]);

  useEffect(() => {
    if (isLoadingInitial || liveCalls.length === 0) return; 

    const intervalId = setInterval(async () => {
      const newCall = await generateNewCall();
      if (newCall) {
        setLiveCalls(prevCalls => {
          // Avoid adding if the same coin is already present to prevent immediate visual duplicates
          // This logic can be adjusted based on desired behavior (e.g., update existing)
          if (prevCalls.some(existingCall => existingCall.coinSymbol === newCall.coinSymbol)) {
            return prevCalls; 
          }

          const calls = [...prevCalls];
          if (calls.length >= NUMBER_OF_CALLS_MANAGED_BY_HOOK) {
            calls.shift(); // Remove the oldest call
          }
          calls.push(newCall); // Add the new call
          return calls;
        });
      }
    }, 7000); // Interval for new calls

    return () => clearInterval(intervalId);
  }, [isLoadingInitial, generateNewCall, liveCalls.length]); // liveCalls.length added to re-evaluate if it becomes 0

  return { liveCalls, isLoadingInitial };
}

    