
'use server';
/**
 * @fileOverview Fetches data from DexScreener, filters promising coins,
 * and uses an AI to choose the best one and generate a complete trade call.
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
  motivo: z.string().optional().describe('Um motivo técnico conciso para a call de trade da moeda escolhida, ou uma explicação se nenhuma call for gerada ou se os dados de entrada indicarem ausência de informação. Baseado nos dados de mercado fornecidos.'),
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


const generateTradeCallPrompt = ai.definePrompt({
  name: 'generateTradeCallPrompt',
  input: {schema: z.object({ marketAnalysisData: z.string() })},
  output: {schema: GeneratedTradeCallOutputSchema},
  prompt: `
Você é um trader profissional.
Sua principal diretriz é: **Sempre gere uma call de trade**, mesmo que o risco seja alto. Escolha a melhor oportunidade disponível com base nos dados fornecidos. **Nunca responda que não há oportunidades.**

Analise a(s) moeda(s) listada(s) abaixo em 'Moeda(s) Analisada(s)'. Escolha **apenas uma** moeda e gere uma call completa incluindo:
- Nome da moeda
- Preço de entrada ideal (Entry)
- Alvo 1 e Alvo 2 (Take Profit)
- Stop Loss
- Risco (Baixo, Médio ou Alto)
- Motivo técnico da entrada
- Hora recomendada da entrada (em UTC)

Moeda(s) Analisada(s):
{{{marketAnalysisData}}}

Se os dados em 'Moeda(s) Analisada(s)' indicarem explicitamente 'Nenhuma informação válida para gerar call neste momento', 'Nenhuma moeda atendeu aos critérios de filtragem para gerar call neste momento', ou se a lista estiver efetivamente vazia ou contiver apenas mensagens de erro da API (como 'Erro ao buscar dados da DexScreener' ou 'Timeout ao buscar dados da DexScreener'), então sua resposta DEVE ser estruturada com "moeda": "Nenhuma call no momento" e um "motivo" explicando a ausência de dados válidos ou o problema.
Caso contrário, VOCÊ DEVE ESCOLHER UMA MOEDA E GERAR UMA CALL COMPLETA.
    `.trim(),
});

const generateTradeCallFlow = ai.defineFlow(
  {
    name: 'generateTradeCallFlow',
    inputSchema: GenerateTradeCallInputSchema,
    outputSchema: GeneratedTradeCallOutputSchema,
  },
  async (): Promise<GeneratedTradeCallOutput> => {
    let marketAnalysisData = "Nenhuma informação válida para gerar call neste momento.";
    let pairs: DexScreenerPair[] = [];
    const apiUrl = "https://api.dexscreener.com/latest/dex/pairs/solana/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzL7EMemjc70dp,82ZJj2gXhL7p7tSAmE2z4hMv5f5sKRjS2wWqS6u6VBiM,32CKP31hST2bvaGKMEMLh2Xm9sN6gQp64t56pjpCMg1T,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xPgt7QCUsKSDbEBA,JUPyiWgKj3p5V4x4zzq9W9gUf2g8JBvWcK2x2Azft3p,KNCRHVxYSH4uLKejZFSjdz2WwXJtre4CZRPSXkahrwp";
    let servedFromCache = false;

    try {
      if (dexScreenerCache.has(apiUrl)) {
        const entry = dexScreenerCache.get(apiUrl)!;
        if (Date.now() - entry.timestamp < DEXSCREENER_CACHE_TTL_MS) {
          console.log("Usando dados da DexScreener do cache.");
          pairs = entry.data.pairs || [];
          servedFromCache = true;
        } else {
          dexScreenerCache.delete(apiUrl);
          console.log("Cache da DexScreener expirado.");
        }
      }

      if (!servedFromCache) {
        console.log(`Buscando dados da DexScreener API: ${apiUrl}`);
        const response = await axios.get<DexScreenerApiResponse>(apiUrl, { timeout: DEXSCREENER_API_TIMEOUT_MS });
        pairs = response.data.pairs || [];
        if (pairs.length > 0) {
          dexScreenerCache.set(apiUrl, { data: response.data, timestamp: Date.now() });
          console.log("Dados da DexScreener cacheados.");
        } else {
          console.log("Nenhum par retornado pela API DexScreener, não cacheando.");
        }
      }

      const filtered = pairs.filter((pair) => {
        const vol = parseFloat(pair.volume?.h24 || '0');
        const liq = parseFloat(pair.liquidity?.usd || '0');
        const priceChange1h = parseFloat(pair.priceChange?.h1 || '0');
        const priceChange24h = parseFloat(pair.priceChange?.h24 || '0');

        return vol >= 20000 && liq >= 5000 && (priceChange1h > 5 || priceChange24h > 10);
      });

      if (filtered.length > 0) {
        const topCoins = filtered
          .sort((a, b) => parseFloat(b.volume?.h24 || '0') - parseFloat(a.volume?.h24 || '0'))
          .slice(0, 3); 

        marketAnalysisData = topCoins.map((coin) => {
          return `- ${coin.baseToken.name} (${coin.baseToken.symbol}): volume $${coin.volume?.h24 || 'N/A'}, liquidez $${coin.liquidity?.usd || 'N/A'}, +${coin.priceChange?.h1 || '0'}% em 1h, +${coin.priceChange?.h24 || '0'}% em 24h, preço: $${coin.priceUsd || 'N/A'}`;
        }).join("\n");
      } else {
         marketAnalysisData = "Nenhuma moeda atendeu aos critérios de filtragem para gerar call neste momento.";
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Erro ao buscar ou processar dados da API DexScreener:", errorMessage);
      if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') { // Especificamente para timeout
        marketAnalysisData = `Erro: Timeout ao buscar dados da DexScreener. Detalhes: ${errorMessage}`;
      } else {
        marketAnalysisData = `Erro ao buscar dados da DexScreener. Detalhes: ${errorMessage}`;
      }
    }

    console.log("Dados enviados para a IA:", marketAnalysisData);

    const {output} = await generateTradeCallPrompt({ marketAnalysisData });
    if (!output) {
      throw new Error("A IA não retornou uma saída para a geração da call de trade.");
    }
    
    if (output.moeda !== "Nenhuma call no momento" && output.moeda !== "Nenhuma call será feita agora" && !output.hora_call) {
        const now = new Date();
        output.hora_call = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`;
    }

    return output;
  }
);

export async function generateTradeCall(): Promise<GeneratedTradeCallOutput> {
  return generateTradeCallFlow({});
}

