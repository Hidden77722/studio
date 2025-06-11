
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

// Input schema is now an empty object as the flow fetches its own data
// but needs a valid schema for Genkit.
const GenerateTradeCallInputSchema = z.object({});
export type GenerateTradeCallInput = z.infer<typeof GenerateTradeCallInputSchema>;


// Schema de saída: a call de trade gerada ou indicação de nenhuma call
const GeneratedTradeCallOutputSchema = z.object({
  moeda: z.string().describe('O nome da moeda escolhida para a call, ou "Nenhuma call no momento" se nenhuma for considerada promissora.'),
  hora_call: z.string().optional().describe('A hora ideal de entrada sugerida em formato UTC (ex: "14:30 UTC"). Opcional se nenhuma call for recomendada.'),
  entrada: z.string().optional().describe('O preço de entrada sugerido para a moeda escolhida, formatado como string com "$" (ex: "$0.00000421"). Opcional se nenhuma call for recomendada.'),
  alvos: z.array(
    z.object({
      preco: z.string().describe("Preço alvo para take profit, formatado como string com '$'."),
      observacao: z.string().optional().describe("Observação adicional para o alvo, se houver.")
    })
  ).length(2).optional().describe("Uma lista contendo exatamente dois alvos de lucro (take profit) para a moeda escolhida. Opcional se nenhuma call for recomendada."),
  stop: z.string().optional().describe('O preço de stop loss sugerido para a moeda escolhida, formatado como string com "$" (ex: "$0.00000390"). Opcional se nenhuma call for recomendada.'),
  motivo: z.string().optional().describe('Um motivo conciso e técnico para a call de trade da moeda escolhida, ou uma explicação se nenhuma call for gerada. Baseado nos dados de mercado fornecidos.'),
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


const generateTradeCallPrompt = ai.definePrompt({
  name: 'generateTradeCallPrompt',
  input: {schema: z.object({ marketAnalysisData: z.string() })},
  output: {schema: GeneratedTradeCallOutputSchema},
  prompt: `
Você é um analista de criptomoedas especializado em identificar oportunidades de trade com alta chance de acerto, mesmo em condições de risco elevado.

Abaixo estão moedas reais do mercado. Escolha a **melhor entre elas**, mesmo que não seja perfeita, e gere uma **call completa**, com:

- Nome da moeda
- Preço de entrada
- Alvo 1 e Alvo 2 (Take Profit)
- Stop Loss
- Hora ideal de entrada (UTC)
- Motivo técnico da entrada
- Classificação de risco (Baixo, Médio ou Alto)

Se todas forem de risco alto, escolha a menos arriscada. Só diga “nenhuma call será feita” se não houver **nenhuma informação válida**.

🔍 **Lista de moedas disponíveis:**
{{{marketAnalysisData}}}
    `.trim(),
});

const generateTradeCallFlow = ai.defineFlow(
  {
    name: 'generateTradeCallFlow',
    inputSchema: GenerateTradeCallInputSchema, // Expects an empty object
    outputSchema: GeneratedTradeCallOutputSchema,
  },
  async (): Promise<GeneratedTradeCallOutput> => {
    let marketAnalysisData = "Nenhuma moeda com potencial suficiente para gerar call."; // Default message if no coins pass filters
    try {
      // Using a limited set of pairs for example, replace with the full API for more results
      // const response = await axios.get<DexScreenerApiResponse>("https://api.dexscreener.com/latest/dex/pairs");
      const response = await axios.get<DexScreenerApiResponse>("https://api.dexscreener.com/latest/dex/pairs/solana/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzL7EMemjc70dp,82ZJj2gXhL7p7tSAmE2z4hMv5f5sKRjS2wWqS6u6VBiM,32CKP31hST2bvaGKMEMLh2Xm9sN6gQp64t56pjpCMg1T,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xPgt7QCUsKSDbEBA,JUPyiWgKj3p5V4x4zzq9W9gUf2g8JBvWcK2x2Azft3p,KNCRHVxYSH4uLKejZFSjdz2WwXJtre4CZRPSXkahrwp");
      const pairs = response.data.pairs || [];

      // Updated filter criteria: vol >= 20k, liq >= 5k, (priceChange1h > 5% OR priceChange24h > 10%)
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
          .slice(0, 3); // Consider top 3

        marketAnalysisData = topCoins.map((coin) => {
          return `- ${coin.baseToken.name} (${coin.baseToken.symbol}): volume $${coin.volume?.h24 || 'N/A'}, liquidez $${coin.liquidity?.usd || 'N/A'}, +${coin.priceChange?.h1 || '0'}% em 1h, +${coin.priceChange?.h24 || '0'}% em 24h, preço: $${coin.priceUsd || 'N/A'}`;
        }).join("\n");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Erro ao buscar ou processar dados da API DexScreener:", errorMessage);
      // marketAnalysisData remains the default message if API fails
    }
    
    console.log("Dados enviados para a IA:", marketAnalysisData);

    // If marketAnalysisData is still the default "Nenhuma moeda..." message,
    // it means either the API failed or no coins passed the filter.
    // In this case, the AI will be explicitly told that no valid info is available.
    const {output} = await generateTradeCallPrompt({ marketAnalysisData });
    if (!output) {
      throw new Error("A IA não retornou uma saída para a geração da call de trade.");
    }
    
    // Add current time if a call is made and hora_call is not provided by AI
    // and the AI decided to make a call.
    if (output.moeda !== "Nenhuma call no momento" && !output.hora_call && output.moeda !== "Nenhuma call será feita agora") {
        const now = new Date();
        output.hora_call = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`;
    }

    return output;
  }
);

export async function generateTradeCall(): Promise<GeneratedTradeCallOutput> {
  return generateTradeCallFlow({}); // Pass an empty object as input
}

