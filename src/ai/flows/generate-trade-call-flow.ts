
'use server';
/**
 * @fileOverview Fetches data from DexScreener, simulates Moralis wallet activity,
 * filters promising coins, and uses an AI to choose the best one and generate a complete trade call.
 *
 * - generateTradeCall - The function that fetches data and generates the trade call.
 * - GeneratedTradeCallOutput - The return type for the generateTradeCall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import axios from 'axios';

// Input schema is an empty object because the flow fetches its own data.
const GenerateTradeCallInputSchema = z.object({});
export type GenerateTradeCallInput = z.infer<typeof GenerateTradeCallInputSchema>;


const GeneratedTradeCallOutputSchema = z.object({
  moeda: z.string().describe('O nome da moeda escolhida para a call, ou "Nenhuma call no momento" se nenhuma for considerada promissora ou se os dados de entrada indicarem ausência de informação.'),
  hora_call: z.string().optional().describe('A hora ideal de entrada sugerida em formato HH:MM UTC (ex: "14:30 UTC"). Opcional se nenhuma call for recomendada, mas esperado se uma call for gerada.'),
  entrada: z.string().optional().describe('O preço de entrada ideal (Entry) sugerido para a moeda escolhida, formatado como string com "$" (ex: "$0.00000421"). Opcional se nenhuma call for recomendada.'),
  alvos: z.array(
    z.object({
      preco: z.string().describe("Preço alvo para take profit, formatado como string com '$'."),
      observacao: z.string().optional().describe("Observação adicional para o alvo, se houver.")
    })
  ).length(2).optional().describe("Uma lista contendo exatamente dois alvos de lucro (take profit) para a moeda escolhida. Opcional se nenhuma call for recomendada."),
  stop: z.string().optional().describe('O preço de stop loss sugerido para a moeda escolhida, formatado como string com "$" (ex: "$0.00000390"). Opcional se nenhuma call for recomendada.'),
  motivo: z.string().optional().describe('Um motivo técnico conciso para a call de trade da moeda escolhida, ou uma explicação se nenhuma call for gerada ou se os dados de entrada indicarem ausência de informação. Baseado nos dados de mercado e atividade de carteiras fornecidos.'),
  risco: z.enum(["Baixo", "Médio", "Alto", "Nenhum"]).optional().describe("A classificação de risco da call de trade para a moeda escolhida (Baixo, Médio, ou Alto). 'Nenhum' se nenhuma call for recomendada.")
});
export type GeneratedTradeCallOutput = z.infer<typeof GeneratedTradeCallOutputSchema>;


interface DexScreenerPair {
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd?: string;
  priceChange: {
    h1?: string;
    h24?: string;
  };
  liquidity?: {
    usd?: string;
    base?: number;
    quote?: number;
  };
  volume: {
    h24?: string;
  };
}

interface DexScreenerApiResponse {
  pairs: DexScreenerPair[];
}

interface DexScreenerCacheEntry {
  data: DexScreenerApiResponse;
  timestamp: number;
}
const dexScreenerCache = new Map<string, DexScreenerCacheEntry>();
const DEXSCREENER_CACHE_TTL_MS = 30 * 1000; // Cache por 30 segundos
const DEXSCREENER_API_TIMEOUT_MS = 8000; // Timeout da API de 8 segundos

// --- Simulação de Atividade Moralis ---
const TRACKED_WALLETS_PLACEHOLDER = [ '0xWHALE_ADDRESS_1_PLACEHOLDER', '0xINSIDER_ADDRESS_2_PLACEHOLDER', 'DXUDwz9Wu5sSiomqRYkpiB95MrBuxLDRYSNXvCPDnGCM' ];

// Usaremos endereços de PARES da Solana para a DexScreener.
// O símbolo no valor do mapa deve ser o símbolo do TOKEN BASE do par.
const MEMECOIN_PAIRS_FOR_DEXSCREENER: Record<string, string> = {
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzL7EMemjc70dp': 'WIF',  // WIF/SOL (Dogwifhat)
  '82ZJj2gXhL7p7tSAmE2z4hMv5f5sKRjS2wWqS6u6VBiM': 'BONK', // BONK/SOL (Bonk)
  '6gnCPhXtLnUD76HjLE21o4h77LpZMBk2Cjp21g3gD72N': 'PEPE', // PEPE/SOL (Pepe)
  'KNCRHVxYSH4uLKejZFSjdz2WwXJtre4CZRPSXkahrwp': 'WEN',  // WEN/SOL (Wen)
  // Adicionar outros pares de memecoins conhecidos da Solana ou outras redes se necessário
  // 'pair_address_popcat_sol': 'POPCAT',
  // 'pair_address_myro_sol': 'MYRO',
};


interface SimulatedMoralisTransfer {
  wallet: string;
  tokenSymbol: string;
  tokenAddress: string; // Este será o endereço do PAR para consistência com DexScreener na simulação
  action: 'comprou' | 'vendeu';
  amount: string;
  timestamp: string;
}

function simulateMoralisActivity(): SimulatedMoralisTransfer[] {
  const results: SimulatedMoralisTransfer[] = [];
  const now = new Date();

  TRACKED_WALLETS_PLACEHOLDER.forEach(wallet => {
    const numberOfActions = Math.floor(Math.random() * 3); 
    for (let i = 0; i < numberOfActions; i++) {
      const pairAddresses = Object.keys(MEMECOIN_PAIRS_FOR_DEXSCREENER);
      const randomPairAddress = pairAddresses[Math.floor(Math.random() * pairAddresses.length)];
      const tokenSymbol = MEMECOIN_PAIRS_FOR_DEXSCREENER[randomPairAddress] || 'UNKNOWN_TOKEN';
      
      const action: 'comprou' | 'vendeu' = Math.random() > 0.5 ? 'comprou' : 'vendeu';
      const amount = (Math.random() * 1000000 + 500000).toLocaleString('pt-BR', {maximumFractionDigits: 0}); 
      
      const randomMinutesAgo = Math.floor(Math.random() * 5);
      const actionTimestamp = new Date(now.getTime() - randomMinutesAgo * 60 * 1000);

      results.push({
        wallet: wallet.substring(0, 6) + '...' + wallet.substring(wallet.length - 4),
        tokenSymbol,
        tokenAddress: randomPairAddress, // Usando o endereço do par aqui
        action,
        amount,
        timestamp: actionTimestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      });
    }
  });
  console.log('[SimulateMoralisActivity] Atividade simulada:', results);
  return results;
}
// --- Fim da Simulação de Atividade Moralis ---


const generateTradeCallPrompt = ai.definePrompt({
  name: 'generateTradeCallPrompt',
  input: {schema: z.object({ marketAnalysisData: z.string(), simulatedWalletActivityData: z.string().optional() })},
  output: {schema: GeneratedTradeCallOutputSchema},
  prompt: `
Você é um trader profissional de memecoins.
Sua principal diretriz é: **Sempre gere uma call de trade**, mesmo que o risco seja alto, se houver dados de mercado ou de carteiras. Escolha a melhor oportunidade disponível com base nos dados fornecidos em 'Moeda(s) Analisada(s) da DexScreener' E/OU 'Atividade de Carteiras Monitoradas'.
**Baseie sua call *estritamente* nas moedas (nome e símbolo) listadas em 'Moeda(s) Analisada(s) da DexScreener' ou mencionadas em 'Atividade de Carteiras Monitoradas'. Não invente nomes ou símbolos de moedas.**
**Nunca responda que não há oportunidades, a menos que AMBAS as seções de dados ('Moeda(s) Analisada(s) da DexScreener' e 'Atividade de Carteiras Monitoradas') explicitamente indiquem um erro, ausência total de dados, ou estejam vazias.**

Analise os dados abaixo. Escolha **apenas uma** moeda e gere uma call completa incluindo:
- Nome da moeda
- Preço de entrada ideal (Entry)
- Alvo 1 e Alvo 2 (Take Profit)
- Stop Loss
- Risco (Baixo, Médio ou Alto)
- Motivo técnico e/ou fundamentalista da entrada (considere a atividade de carteiras como um forte sinal fundamentalista/sentimento)
- Hora recomendada da entrada (em UTC, como a hora atual da análise)

Moeda(s) Analisada(s) da DexScreener:
{{{marketAnalysisData}}}

{{#if simulatedWalletActivityData}}
Atividade de Carteiras Monitoradas (Simulado - Moralis):
{{{simulatedWalletActivityData}}}
Considere grandes compras por carteiras monitoradas como um sinal de alta especialmente forte para a moeda correspondente.
{{/if}}

Se os dados em 'Moeda(s) Analisada(s) da DexScreener' indicarem explicitamente 'Nenhuma informação válida para gerar call neste momento', 'Nenhuma moeda atendeu aos critérios de filtragem para gerar call neste momento', ou se a lista estiver efetivamente vazia ou contiver apenas mensagens de erro da API (como 'Erro ao buscar dados da DexScreener' ou 'Timeout ao buscar dados da DexScreener'), E TAMBÉM a 'Atividade de Carteiras Monitoradas' estiver vazia, não fornecer sinais claros ou indicar ausência de dados, então sua resposta DEVE ser estruturada com "moeda": "Nenhuma call no momento" e um "motivo" explicando a ausência de dados válidos ou o problema.
Caso contrário, mesmo que apenas uma moeda esteja listada ou os dados pareçam limitados, VOCÊ DEVE ESCOLHER UMA MOEDA E GERAR UMA CALL COMPLETA, priorizando sinais de atividade de carteiras se disponíveis e os dados da DexScreener para essa moeda forem insuficientes.
O campo "moeda" na sua resposta DEVE ser o nome completo da moeda seguido pelo seu símbolo entre parênteses, conforme fornecido nos dados (ex: Dogwifhat (WIF)).
    `.trim(),
});

const generateTradeCallFlow = ai.defineFlow(
  {
    name: 'generateTradeCallFlow',
    inputSchema: GenerateTradeCallInputSchema,
    outputSchema: GeneratedTradeCallOutputSchema,
  },
  async (): Promise<GeneratedTradeCallOutput> => {
    let marketAnalysisData = "Nenhuma informação válida para gerar call neste momento (DexScreener).";
    let pairs: DexScreenerPair[] = [];
    const apiUrl = "https://api.dexscreener.com/latest/dex/pairs/solana/" + Object.keys(MEMECOIN_PAIRS_FOR_DEXSCREENER).join(',');
    let servedFromCache = false;

    try {
      console.log("[GenerateTradeCallFlow] Iniciando busca de dados da DexScreener...");
      if (dexScreenerCache.has(apiUrl)) {
        const entry = dexScreenerCache.get(apiUrl)!;
        if (Date.now() - entry.timestamp < DEXSCREENER_CACHE_TTL_MS) {
          console.log("[GenerateTradeCallFlow] Usando dados da DexScreener do cache.");
          pairs = entry.data.pairs || [];
          servedFromCache = true;
        } else {
          dexScreenerCache.delete(apiUrl);
          console.log("[GenerateTradeCallFlow] Cache da DexScreener expirado.");
        }
      }

      if (!servedFromCache) {
        console.log(`[GenerateTradeCallFlow] Buscando dados da DexScreener API: ${apiUrl}`);
        const response = await axios.get<DexScreenerApiResponse>(apiUrl, { timeout: DEXSCREENER_API_TIMEOUT_MS });
        console.log("[GenerateTradeCallFlow] Dados brutos da DexScreener recebidos:", JSON.stringify(response.data, null, 2));
        pairs = response.data.pairs || [];
        if (pairs.length > 0) {
          dexScreenerCache.set(apiUrl, { data: response.data, timestamp: Date.now() });
          console.log("[GenerateTradeCallFlow] Dados da DexScreener cacheados.");
        } else {
          console.log("[GenerateTradeCallFlow] Nenhum par retornado pela API DexScreener, não cacheando.");
        }
      }
      
      console.log("[GenerateTradeCallFlow] Pares antes da filtragem:", JSON.stringify(pairs, null, 2));

      const filtered = pairs.filter((pair) => {
        const vol = parseFloat(pair.volume?.h24 || '0');
        const liq = parseFloat(pair.liquidity?.usd || '0');
        const priceChange1h = parseFloat(pair.priceChange?.h1 || '0');
        const priceChange24h = parseFloat(pair.priceChange?.h24 || '0');
        return vol >= 20000 && liq >= 5000 && (priceChange1h > 5 || priceChange24h > 10);
      });

      console.log("[GenerateTradeCallFlow] Pares após a filtragem:", JSON.stringify(filtered, null, 2));

      if (filtered.length > 0) {
        const topCoins = filtered
          .sort((a, b) => parseFloat(b.volume?.h24 || '0') - parseFloat(a.volume?.h24 || '0'))
          .slice(0, 3); 

        marketAnalysisData = topCoins.map((coin) => {
          // O nome e símbolo vêm de coin.baseToken.name e coin.baseToken.symbol
          return `- ${coin.baseToken.name} (${coin.baseToken.symbol}): volume $${coin.volume?.h24 || 'N/A'}, liquidez $${coin.liquidity?.usd || 'N/A'}, +${coin.priceChange?.h1 || '0'}% em 1h, +${coin.priceChange?.h24 || '0'}% em 24h, preço: $${coin.priceUsd || 'N/A'}`;
        }).join("\n");
      } else if (pairs.length > 0 && filtered.length === 0) {
         marketAnalysisData = "Nenhuma moeda atendeu aos critérios de filtragem para gerar call neste momento (DexScreener), mas dados foram recebidos da API.";
         console.log("[GenerateTradeCallFlow] Dados recebidos da API DexScreener, mas nenhuma moeda passou nos filtros.");
      } else if (pairs.length === 0 && !servedFromCache) {
         marketAnalysisData = "Nenhum dado de par foi retornado pela API DexScreener.";
         console.log("[GenerateTradeCallFlow] Nenhum dado de par retornado pela API DexScreener.");
      } else if (pairs.length === 0 && servedFromCache) {
        marketAnalysisData = "Nenhum dado de par encontrado no cache da DexScreener.";
        console.log("[GenerateTradeCallFlow] Nenhum dado de par encontrado no cache da DexScreener (pode ter sido uma resposta vazia cacheada anteriormente).");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[GenerateTradeCallFlow] Erro ao buscar ou processar dados da API DexScreener:", errorMessage);
      if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') { 
        marketAnalysisData = `Erro: Timeout ao buscar dados da DexScreener. Detalhes: ${errorMessage}`;
      } else {
        marketAnalysisData = `Erro ao buscar dados da DexScreener. Detalhes: ${errorMessage}`;
      }
    }

    console.log("[GenerateTradeCallFlow] Dados da DexScreener para IA:", marketAnalysisData);

    // Simular atividade Moralis
    const simulatedMoralisTransfers = simulateMoralisActivity();
    let simulatedWalletActivityData = "";
    if (simulatedMoralisTransfers.length > 0) {
      simulatedWalletActivityData = simulatedMoralisTransfers.map(tx => 
        // A simulação da Moralis já usa o tokenSymbol correto do MEMECOIN_PAIRS_FOR_DEXSCREENER
        `- Carteira ${tx.wallet} ${tx.action} ${tx.amount} ${tx.tokenSymbol} (Par: ${tx.tokenAddress.substring(0,6)}...) às ${tx.timestamp}`
      ).join("\n");
      console.log("[GenerateTradeCallFlow] Dados de atividade de carteiras simulados (Moralis) para IA:", simulatedWalletActivityData);
    } else {
      console.log("[GenerateTradeCallFlow] Nenhuma atividade de carteira simulada (Moralis) para enviar à IA.");
      simulatedWalletActivityData = "Nenhuma atividade de carteira monitorada relevante detectada recentemente.";
    }


    const {output} = await generateTradeCallPrompt({ marketAnalysisData, simulatedWalletActivityData });
    if (!output) {
      console.error("[GenerateTradeCallFlow] A IA não retornou uma saída para a geração da call de trade.");
      return {
        moeda: "Nenhuma call no momento",
        motivo: "A IA não conseguiu gerar uma resposta válida com os dados atuais.",
        risco: "Nenhum"
      };
    }
    
    if (output.moeda && output.moeda !== "Nenhuma call no momento" && output.moeda !== "Nenhuma call será feita agora" && !output.hora_call) {
        const now = new Date();
        output.hora_call = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`;
        console.log(`[GenerateTradeCallFlow] Hora da call adicionada: ${output.hora_call}`);
    }

    console.log("[GenerateTradeCallFlow] Saída da IA:", JSON.stringify(output, null, 2));
    return output;
  }
);

export async function generateTradeCall(): Promise<GeneratedTradeCallOutput> {
  return generateTradeCallFlow({});
}

    