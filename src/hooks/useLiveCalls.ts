
"use client";

import type { MemeCoinCall } from "@/lib/types";
import React, { useState, useEffect, useCallback } from 'react';

// REAL_COIN_POOL agora usa contractAddress como identificador principal para Birdeye
// e placehold.co para image URLs.
const REAL_COIN_POOL = [
  { contractAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzL7EMemjc70dp', name: 'Dogecoin (Simulado)', symbol: 'DOGE', imageUrl: 'https://placehold.co/40x40.png?text=DG', logoAiHint: 'dogecoin logo' },
  { contractAddress: 'shib_contract_placeholder', name: 'Shiba Inu (Simulado)', symbol: 'SHIB', imageUrl: 'https://placehold.co/40x40.png?text=SH', logoAiHint: 'shiba inu' },
  { contractAddress: 'pepe_contract_placeholder', name: 'Pepe (Simulado)', symbol: 'PEPE', imageUrl: 'https://placehold.co/40x40.png?text=PP', logoAiHint: 'pepe frog' },
  { contractAddress: 'bonk_contract_placeholder', name: 'Bonk (Simulado)', symbol: 'BONK', imageUrl: 'https://placehold.co/40x40.png?text=BK', logoAiHint: 'bonk dog' },
  { contractAddress: 'wif_contract_placeholder', name: 'Dogwifhat (Simulado)', symbol: 'WIF', imageUrl: 'https://placehold.co/40x40.png', logoAiHint: 'dog hat' },
  { contractAddress: 'floki_contract_placeholder', name: 'FLOKI (Simulado)', symbol: 'FLOKI', imageUrl: 'https://placehold.co/40x40.png?text=FL', logoAiHint: 'floki inu' }
];

const ALERT_TEMPLATES = [
  {
    idBase: "template1",
    reason: "Pump massivo coordenado no Twitter e Reddit, indicadores técnicos confirmando rompimento. Volume na (Exchange X) subindo.",
    targetsConfig: [{ multiplier: 1.5, percentageFormat: "+50%" }, { multiplier: 2.0, percentageFormat: "+100%" }],
    stopLossConfig: { multiplier: 0.85 },
    technicalAnalysisSummary: "Acaba de romper uma cunha descendente com volume 5x acima da média. RSI no gráfico de 1H está em 70.",
    marketSentimentSummary: "Campanha #ToTheMoon viralizando no Twitter. Posts em r/MemeCoinMoonshots explodindo. Sentimento de FOMO.",
  },
  {
    idBase: "template2",
    reason: "Anúncio de parceria com grande influenciador e listagem iminente em corretora. Gráfico mostra acumulação.",
    targetsConfig: [{ multiplier: 1.8, percentageFormat: "+80%" }, { multiplier: 2.5, percentageFormat: "+150%" }],
    stopLossConfig: { multiplier: 0.9 },
    technicalAnalysisSummary: "Formou um padrão 'copo e alça' no gráfico de 4H. Volume de acumulação tem aumentado.",
    marketSentimentSummary: "Influenciador 'CryptoGuru' (10M seguidores) postou sobre a moeda. Rumores de listagem na 'MemeXchange'.",
  },
  {
    idBase: "template3",
    reason: "Nova narrativa 'Killer 2.0' ganhando tração no Reddit. Análise de contrato indica baixo risco.",
    targetsConfig: [{ multiplier: 2.0, percentageFormat: "+100%" }, { multiplier: 3.0, percentageFormat: "+200%" }],
    stopLossConfig: { multiplier: 0.8 },
    technicalAnalysisSummary: "Formando um fundo arredondado no gráfico de 15min, com divergência bullish no MACD.",
    marketSentimentSummary: "Thread viral em r/SatoshiStreetBets. Diversos tweets de contas de 'crypto gems' mencionando.",
  }
];

const NUMBER_OF_CALLS_MANAGED_BY_HOOK = 3;
const MAX_FETCH_RETRIES = 5;
const RETRY_DELAY_MS = 2000; // Base delay for Birdeye/DexScreener (placeholder) attempts

// Placeholder para a função de busca da API Birdeye
async function fetchPriceFromBirdeyeAPI(contractAddress: string | null): Promise<number | null> {
  if (!contractAddress) {
    console.warn(`[Birdeye Placeholder] Tentando buscar preço, mas o endereço do contrato não foi fornecido.`);
    return null;
  }
  console.log(`[Birdeye Placeholder] Simulating price fetch for contract: ${contractAddress}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const mockPrice = Math.random() * 0.001 + 0.00001;
  console.log(`[Birdeye Placeholder] Mock price for ${contractAddress}: ${mockPrice}`);
  return mockPrice;
}

// Placeholder para a função de busca da API DexScreener
async function fetchDexScreenerData(pairAddress: string | null): Promise<{ volume24h: number; liquidityUSD: number } | null> {
  if (!pairAddress) {
    console.warn(`[DexScreener Placeholder] Tentando buscar dados, mas o endereço do par não foi fornecido.`);
    return null;
  }
  console.log(`[DexScreener Placeholder] Simulating data fetch for pair: ${pairAddress}`);
  await new Promise(resolve => setTimeout(resolve, 600)); // Simula latência
  const mockData = {
    volume24h: Math.floor(Math.random() * 1000000) + 50000, // Mock volume
    liquidityUSD: Math.floor(Math.random() * 500000) + 10000, // Mock liquidity
  };
  console.log(`[DexScreener Placeholder] Mock data for ${pairAddress}:`, mockData);
  return mockData;
}


async function fetchCoinPrice(contractAddress: string | null): Promise<number | null> {
  let attempts = 0;
  console.log(`Iniciando busca de preço para o contrato: ${contractAddress || 'N/A'} (tentativa ${attempts + 1})`);

  while (attempts < MAX_FETCH_RETRIES) {
    try {
      // Apenas tenta Birdeye (placeholder), já que CoinGecko foi removida
      const price = await fetchPriceFromBirdeyeAPI(contractAddress);

      if (price !== null) {
        console.log(`Preço obtido da Birdeye (placeholder) para ${contractAddress || 'N/A'} na tentativa ${attempts + 1}: ${price}`);
        return price;
      }
      console.warn(`Falha ao obter preço da Birdeye (placeholder) para ${contractAddress || 'N/A'} (tentativa ${attempts + 1}/${MAX_FETCH_RETRIES}).`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Erro na tentativa ${attempts + 1}/${MAX_FETCH_RETRIES} de buscar preço para ${contractAddress || 'N/A'} via Birdeye (placeholder): ${errorMessage}`);
    }

    attempts++;
    if (attempts < MAX_FETCH_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempts -1); // Backoff exponencial
      console.log(`Tentando novamente em ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.warn(`Falha ao obter preço para ${contractAddress || 'N/A'} após ${MAX_FETCH_RETRIES} tentativas usando Birdeye (placeholder).`);
  return null;
}

export function useLiveCalls() {
  const [liveCalls, setLiveCalls] = useState<MemeCoinCall[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const generateNewCall = useCallback(async (): Promise<MemeCoinCall | null> => {
    const randomTemplate = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
    const randomCoinInfo = REAL_COIN_POOL[Math.floor(Math.random() * REAL_COIN_POOL.length)];

    const currentPrice = await fetchCoinPrice(randomCoinInfo.contractAddress);
    if (currentPrice === null) {
      console.warn(`Não foi possível gerar alerta para ${randomCoinInfo.name} porque o preço não pôde ser obtido.`);
      return null;
    }

    // Buscar dados da DexScreener (mockado)
    const dexData = await fetchDexScreenerData(randomCoinInfo.contractAddress);

    const entryPrice = currentPrice;
    const targets = randomTemplate.targetsConfig.map(t => ({
      price: entryPrice * t.multiplier,
      percentage: t.percentageFormat,
    }));
    const stopLoss = entryPrice * randomTemplate.stopLossConfig.multiplier;
    const now = new Date();

    return {
      id: `${randomTemplate.idBase}-${randomCoinInfo.symbol}-${now.getTime()}`,
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
      volume24h: dexData?.volume24h,
      liquidityUSD: dexData?.liquidityUSD,
    };
  }, []);

  useEffect(() => {
    console.log("Iniciando carregamento de alertas ao vivo (useLiveCalls)...");
    const loadInitialCalls = async () => {
      setIsLoadingInitial(true);
      const newLiveCalls: MemeCoinCall[] = [];
      let generationAttempts = 0;
      const maxGenerationAttempts = NUMBER_OF_CALLS_MANAGED_BY_HOOK * (MAX_FETCH_RETRIES + 2);

      while(newLiveCalls.length < NUMBER_OF_CALLS_MANAGED_BY_HOOK && generationAttempts < maxGenerationAttempts) {
        const call = await generateNewCall();
        if (call) {
          if (!newLiveCalls.some(existingCall => existingCall.coinSymbol === call.coinSymbol)) {
             newLiveCalls.push(call);
          }
        }
        generationAttempts++;
        if (newLiveCalls.length < NUMBER_OF_CALLS_MANAGED_BY_HOOK && generationAttempts < maxGenerationAttempts && !call) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS / 2));
        }
      }
      setLiveCalls(newLiveCalls);
      setIsLoadingInitial(false);
      if (newLiveCalls.length === 0 && generationAttempts >= maxGenerationAttempts) {
        console.warn("Não foi possível carregar nenhum alerta inicial (useLiveCalls) após várias tentativas. Verifique a implementação da API Birdeye/DexScreener e a conexão.");
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
          if (prevCalls.some(existingCall => existingCall.coinSymbol === newCall.coinSymbol)) {
            return prevCalls;
          }
          const calls = [...prevCalls];
          if (calls.length >= NUMBER_OF_CALLS_MANAGED_BY_HOOK) {
            calls.shift();
          }
          calls.push(newCall);
          return calls;
        });
      }
    }, 7000); 

    return () => clearInterval(intervalId);
  }, [isLoadingInitial, generateNewCall, liveCalls.length]);

  return { liveCalls, isLoadingInitial };
}
