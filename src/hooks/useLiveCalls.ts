
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
const RETRY_DELAY_MS = 2000; // Base delay for Birdeye (placeholder) attempts

// Placeholder para a função de busca da API Birdeye
// Em uma implementação real, esta função chamaria seu backend que, por sua vez, chamaria a Birdeye com uma chave de API.
async function fetchPriceFromBirdeyeAPI(contractAddress: string | null): Promise<number | null> {
  if (!contractAddress) {
    console.warn(`Tentando buscar preço da Birdeye, mas o endereço do contrato não foi fornecido.`);
    return null;
  }

  console.log(`[Birdeye Placeholder] Simulating fetch for contract: ${contractAddress}`);
  // Simula uma chamada de API. Substitua pela sua lógica de backend.
  // Para fins de teste, retorna um preço mockado ou null para simular falhas.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simula latência da rede

  // Chance de simular falha
  // if (Math.random() < 0.3) {
  //   console.warn(`[Birdeye Placeholder] Simulated API fetch failure for ${contractAddress}`);
  //   return null;
  // }

  // Retorna um preço mockado
  const mockPrice = Math.random() * 0.001 + 0.00001;
  console.log(`[Birdeye Placeholder] Mock price for ${contractAddress}: ${mockPrice}`);
  return mockPrice;
}


async function fetchCoinPrice(contractAddress: string | null): Promise<number | null> {
  let attempts = 0;
  console.log(`Iniciando busca de preço para o contrato: ${contractAddress || 'N/A'} (tentativa ${attempts + 1})`);

  while (attempts < MAX_FETCH_RETRIES) {
    try {
      const price = await fetchPriceFromBirdeyeAPI(contractAddress); // Tenta Birdeye (placeholder)

      if (price !== null) {
        console.log(`Preço obtido da Birdeye (placeholder) para ${contractAddress || 'N/A'} na tentativa ${attempts + 1}: ${price}`);
        return price;
      }
      // Se Birdeye (placeholder) falhar, loga e tenta novamente se houver tentativas
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

    const currentPrice = await fetchCoinPrice(randomCoinInfo.contractAddress); // Usa a nova função
    if (currentPrice === null) {
      console.warn(`Não foi possível gerar alerta para ${randomCoinInfo.name} porque o preço não pôde ser obtido.`);
      return null;
    }

    const entryPrice = currentPrice;
    const targets = randomTemplate.targetsConfig.map(t => ({
      price: entryPrice * t.multiplier,
      percentage: t.percentageFormat,
    }));
    const stopLoss = entryPrice * randomTemplate.stopLossConfig.multiplier;
    const now = new Date();

    return {
      id: `${randomTemplate.idBase}-${randomCoinInfo.symbol}-${now.getTime()}`, // Usa symbol para id
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
            // Adiciona um pequeno atraso se a geração da chamada falhar para não sobrecarregar
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS / 2));
        }
      }
      setLiveCalls(newLiveCalls);
      setIsLoadingInitial(false);
      if (newLiveCalls.length === 0 && generationAttempts >= maxGenerationAttempts) {
        console.warn("Não foi possível carregar nenhum alerta inicial (useLiveCalls) após várias tentativas. Verifique a implementação da API Birdeye e a conexão.");
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
          // Evita adicionar duplicatas pelo símbolo da moeda, caso o ID seja muito similar
          if (prevCalls.some(existingCall => existingCall.coinSymbol === newCall.coinSymbol)) {
            // Poderia atualizar o existente aqui, mas para este exemplo, vamos apenas manter o antigo
            return prevCalls;
          }

          const calls = [...prevCalls];
          if (calls.length >= NUMBER_OF_CALLS_MANAGED_BY_HOOK) {
            calls.shift(); // Remove o mais antigo para manter o número de cards
          }
          calls.push(newCall); // Adiciona o novo
          return calls;
        });
      }
    }, 7000); // Intervalo para tentar gerar novo alerta

    return () => clearInterval(intervalId);
  }, [isLoadingInitial, generateNewCall, liveCalls.length]); // Adicionado liveCalls.length como dependência

  return { liveCalls, isLoadingInitial };
}
