
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
  hora_call: z.string().optional().describe('A hora ideal de entrada sugerida em formato HH:MM UTC (ex: "14:30 UTC"). Opcional se nenhuma call for recomendada, mas esperado se uma call for gerada.'),
  entrada: z.string().optional().describe('O preço de entrada ideal (Entry) sugerido para a moeda escolhida, formatado como string com "$" (ex: "$0.00000421"). Opcional se nenhuma call for recomendada.'),
  alvos: z.array(
    z.object({
      preco: z.string().describe("Preço alvo para take profit, formatado como string com '$'."),
      observacao: z.string().optional().describe("Observação adicional para o alvo, se houver.")
    })
  ).length(2).optional().describe("Uma lista contendo exatamente dois alvos de lucro (take profit) para a moeda escolhida. Opcional se nenhuma call for recomendada."),
  stop: z.string().optional().describe('O preço de stop loss sugerido para a moeda escolhida, formatado como string com "$" (ex: "$0.00000390"). Opcional se nenhuma call for recomendada.'),
  motivo: z.string().optional().describe('Um motivo técnico conciso para a call de trade da moeda escolhida, ou uma explicação se nenhuma call for gerada. Baseado nos dados de mercado fornecidos.'),
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
Você é um analista profissional de criptomoedas. Sua função é gerar uma call de trade com base na melhor oportunidade disponível, mesmo em momentos de mercado instável ou com dados de alto risco.

Analise os dados da(s) moeda(s) listada(s) abaixo.
Se houver dados de moedas válidos:
1. Escolha **apenas uma** moeda, a que apresentar a melhor oportunidade.
2. Gere uma **call de trade completa** para essa moeda, incluindo TODOS os seguintes campos:
   - Nome da moeda (ex: "DOGEMOON")
   - Preço de entrada ideal (Entry) (ex: "$0.00000421")
   - Alvo 1 (Take Profit) (ex: "$0.00000550")
   - Alvo 2 (Take Profit) (ex: "$0.00000620")
   - Stop Loss (ex: "$0.00000390")
   - Hora recomendada da entrada (em formato HH:MM UTC, ex: "14:30 UTC")
   - Motivo técnico da entrada (uma breve análise técnica e fundamentalista concisa)
   - Risco (escolha entre: Baixo, Médio, ou Alto)

📌 **VOCÊ DEVE SEMPRE GERAR UMA CALL COMPLETA SE HOUVER DADOS DE MOEDAS VÁLIDOS ABAIXO.**
Mesmo que todas as opções pareçam de alto risco, escolha a moeda que você considera a menos arriscada ou com o maior potencial de curto prazo e gere a call. Não responda que "não há oportunidade" ou que "nenhuma call será feita" se houver moedas listadas com dados.

Se os dados fornecidos em 'Lista de moedas' indicarem explicitamente 'Nenhuma informação válida para gerar call neste momento', ou se a lista estiver efetivamente vazia ou contiver apenas erros, então sua resposta DEVE ser estruturada com "moeda": "Nenhuma call no momento" e um "motivo" explicando a ausência de dados ou o problema.

📊 Lista de moedas:
{{{marketAnalysisData}}}
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
    try {
      
      const response = await axios.get<DexScreenerApiResponse>("https://api.dexscreener.com/latest/dex/pairs/solana/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzL7EMemjc70dp,82ZJj2gXhL7p7tSAmE2z4hMv5f5sKRjS2wWqS6u6VBiM,32CKP31hST2bvaGKMEMLh2Xm9sN6gQp64t56pjpCMg1T,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xPgt7QCUsKSDbEBA,JUPyiWgKj3p5V4x4zzq9W9gUf2g8JBvWcK2x2Azft3p,KNCRHVxYSH4uLKejZFSjdz2WwXJtre4CZRPSXkahrwp");
      const pairs = response.data.pairs || [];

      
      const filtered = pairs.filter((pair) => {
        const vol = parseFloat(pair.volume?.h24 || '0');
        const liq = parseFloat(pair.liquidity?.usd || '0');
        const priceChange1h = parseFloat(pair.priceChange?.h1 || '0');
        const priceChange24h = parseFloat(pair.priceChange?.h24 || '0');
        // Filtro mais leve: volume ≥ 20k, liquidez ≥ 5k, crescimento 5% em 1h OU 10% em 24h
        return vol >= 20000 && liq >= 5000 && (priceChange1h > 5 || priceChange24h > 10);
      });

      if (filtered.length > 0) {
        const topCoins = filtered
          .sort((a, b) => parseFloat(b.volume?.h24 || '0') - parseFloat(a.volume?.h24 || '0'))
          .slice(0, 3); // Limita para as 3 melhores

        marketAnalysisData = topCoins.map((coin) => {
          return `- ${coin.baseToken.name} (${coin.baseToken.symbol}): volume $${coin.volume?.h24 || 'N/A'}, liquidez $${coin.liquidity?.usd || 'N/A'}, +${coin.priceChange?.h1 || '0'}% em 1h, +${coin.priceChange?.h24 || '0'}% em 24h, preço: $${coin.priceUsd || 'N/A'}`;
        }).join("\n");
      } else {
         marketAnalysisData = "Nenhuma moeda atendeu aos critérios de filtragem para gerar call neste momento.";
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Erro ao buscar ou processar dados da API DexScreener:", errorMessage);
      marketAnalysisData = `Erro ao buscar dados da DexScreener. Detalhes: ${errorMessage}`;
    }
    
    console.log("Dados enviados para a IA:", marketAnalysisData);

    const {output} = await generateTradeCallPrompt({ marketAnalysisData });
    if (!output) {
      throw new Error("A IA não retornou uma saída para a geração da call de trade.");
    }
    
    // Se a IA gerou uma call válida (não "Nenhuma call...") mas não forneceu hora_call, defina-a como fallback.
    // O prompt agora pede explicitamente para a IA gerar a hora_call.
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

