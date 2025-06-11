
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
  prompt: `Você é um analista de criptomoedas especializado em identificar oportunidades de trade com alta probabilidade de sucesso, focado principalmente em meme coins.

Abaixo estão moedas reais coletadas do mercado com seus dados atualizados. Sua tarefa é:
1. Analisar cuidadosamente cada moeda na "Lista de moedas disponíveis".
2. Escolher apenas **uma (1)** moeda que você considera ter o MAIOR potencial de lucro imediato.
3. Gerar uma **call de trade completa** para a moeda escolhida, com as seguintes informações:
    -   **moeda**: Nome da moeda escolhida.
    -   **hora_call**: Hora ideal para entrada, em formato UTC (ex: "16:30 UTC"). Considere o momento atual da análise.
    -   **entrada**: Preço de entrada sugerido para a moeda escolhida. Use o preço fornecido nos dados como base. Formate como string com "$" e casas decimais apropriadas para meme coins (ex: "$0.00000421").
    -   **alvos**: Exatamente **dois** preços alvo (Take Profit) realistas e atraentes. Por exemplo, Alvo 1 +20-50% e Alvo 2 +50-100% acima da entrada. Cada alvo deve ser um objeto com um campo 'preco' (string formatada como a entrada).
    -   **stop**: Preço de stop loss realista, limitando perdas potenciais (ex: 10-20% abaixo da entrada). Formate como a entrada.
    -   **motivo**: Motivo claro, técnico e convincente da entrada.
    -   **risco**: Classificação do risco ("Baixo", "Médio", "Alto") para esta call específica.

🔍 **Lista de moedas disponíveis:**
{{{marketAnalysisData}}}

Instruções Importantes:
- Se NENHUMA moeda na lista parecer uma boa oportunidade no momento, no campo 'moeda' retorne "Nenhuma call no momento". Importante: neste caso, o campo 'motivo' DEVE ser preenchido com uma breve explicação do porquê nenhuma call foi gerada (ex: "Nenhuma das moedas analisadas apresentou volume ou variação de preço suficientes para uma entrada segura." ou "Os dados de mercado fornecidos são insuficientes para uma análise conclusiva."). Os outros campos podem ser omitidos ou conter valores indicativos de nenhuma call (ex: risco: "Nenhum").
- Priorize oportunidades com real chance de acerto, não apenas hype vazio.
- Seja decisivo na escolha da moeda. Se mais de uma parecer boa, escolha a melhor.
- Certifique-se de que os preços de entrada, alvos e stop loss sejam consistentes e façam sentido em relação ao preço atual da moeda fornecido nos dados de entrada.
- O campo 'alvos' deve ser um array com exatamente dois objetos, cada um contendo a chave 'preco'.
`,
});

const generateTradeCallFlow = ai.defineFlow(
  {
    name: 'generateTradeCallFlow',
    inputSchema: GenerateTradeCallInputSchema, // Expects an empty object
    outputSchema: GeneratedTradeCallOutputSchema,
  },
  async (): Promise<GeneratedTradeCallOutput> => {
    let marketAnalysisData = "Nenhuma moeda promissora encontrada após filtragem.";
    try {
      // Using a limited set of pairs for example, replace with the full API for more results
      // const response = await axios.get<DexScreenerApiResponse>("https://api.dexscreener.com/latest/dex/pairs");
      const response = await axios.get<DexScreenerApiResponse>("https://api.dexscreener.com/latest/dex/pairs/solana/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzL7EMemjc70dp,82ZJj2gXhL7p7tSAmE2z4hMv5f5sKRjS2wWqS6u6VBiM,32CKP31hST2bvaGKMEMLh2Xm9sN6gQp64t56pjpCMg1T,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xPgt7QCUsKSDbEBA,JUPyiWgKj3p5V4x4zzq9W9gUf2g8JBvWcK2x2Azft3p,KNCRHVxYSH4uLKejZFSjdz2WwXJtre4CZRPSXkahrwp");
      const pairs = response.data.pairs || [];

      // Adjust filter criteria as needed, current example is vol > 10k, liq > 5k
      const filtered = pairs.filter((pair) => {
        const vol = parseFloat(pair.volume?.h24 || '0');
        const liq = parseFloat(pair.liquidity?.usd || '0');
        const priceChange1h = parseFloat(pair.priceChange?.h1 || '0');
        const priceChange24h = parseFloat(pair.priceChange?.h24 || '0');
        return vol >= 10000 && liq >= 5000 && priceChange1h > 0 && priceChange24h > 0;
      });

      if (filtered.length > 0) {
        const topCoins = filtered
          .sort((a, b) => parseFloat(b.volume?.h24 || '0') - parseFloat(a.volume?.h24 || '0'))
          .slice(0, 5); // Consider top 5 to give AI more choice

        marketAnalysisData = topCoins.map((coin) => {
          return `- ${coin.baseToken.name} (${coin.baseToken.symbol}): volume $${coin.volume?.h24 || 'N/A'}, liquidez $${coin.liquidity?.usd || 'N/A'}, +${coin.priceChange?.h1 || '0'}% em 1h, +${coin.priceChange?.h24 || '0'}% em 24h, preço: $${coin.priceUsd || 'N/A'}`;
        }).join("\n");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Erro ao buscar ou processar dados da API DexScreener:", errorMessage);
      // marketAnalysisData remains "Nenhuma moeda promissora encontrada após filtragem."
    }
    
    console.log("Dados enviados para a IA:", marketAnalysisData);

    const {output} = await generateTradeCallPrompt({ marketAnalysisData });
    if (!output) {
      throw new Error("A IA não retornou uma saída para a geração da call de trade.");
    }
    
    // Add current time if a call is made and hora_call is not provided by AI
    if (output.moeda !== "Nenhuma call no momento" && !output.hora_call) {
        const now = new Date();
        output.hora_call = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`;
    }

    return output;
  }
);

export async function generateTradeCall(): Promise<GeneratedTradeCallOutput> {
  return generateTradeCallFlow({}); // Pass an empty object as input
}

