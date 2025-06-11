
'use server';
/**
 * @fileOverview Generates a trade call suggestion using AI based on provided market data.
 *
 * - generateTradeCall - A function that generates the trade call.
 * - GenerateTradeCallInput - The input type for the generateTradeCall function.
 * - GeneratedTradeCallOutput - The return type for the generateTradeCall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradeCallInputSchema = z.object({
  coinName: z.string().describe('The name or symbol of the meme coin.'),
  volume24h: z.number().describe('The trading volume in the last 24 hours (USD).'),
  liquidity: z.number().describe('The current liquidity of the coin in USD.'),
  currentPrice: z.number().describe('The current price of the coin.'),
  priceChange1h: z.number().describe('The price change percentage in the last 1 hour (e.g., 5.5 for +5.5%).'),
  priceChange24h: z.number().describe('The price change percentage in the last 24 hours (e.g., 25.5 for +25.5%).'),
  isOnHotList: z.boolean().describe('Whether the coin is currently on a "Hot" or "Trending" list (e.g., from DexScreener).'),
});
export type GenerateTradeCallInput = z.infer<typeof GenerateTradeCallInputSchema>;

const GeneratedTradeCallOutputSchema = z.object({
  moeda: z.string().describe('O nome ou símbolo da moeda para a call.'),
  entrada: z.string().describe('O preço de entrada sugerido, formatado como string com "$" (ex: "$0.00000421"). Deve ser próximo ao Preço Atual de entrada.'),
  alvos: z.array(
    z.object({
      preco: z.string().describe("Preço alvo para take profit, formatado como string com '$'."),
    })
  ).length(2).describe("Uma lista contendo exatamente dois alvos de lucro (take profit), formatados como string com '$'."),
  stop: z.string().describe('O preço de stop loss sugerido, formatado como string com "$" (ex: "$0.00000390").'),
  motivo: z.string().describe('Um motivo conciso para a call de trade, baseado nos dados de mercado fornecidos.'),
  risco: z.enum(["Baixo", "Médio", "Alto"]).describe("A classificação de risco da call de trade (Baixo, Médio, ou Alto).")
});

// Output type without hora_call for the LLM, as it will be added by the wrapper
type LLMGeneratedTradeCallOutput = Omit<z.infer<typeof GeneratedTradeCallOutputSchema>, 'hora_call'>;
export type GeneratedTradeCallOutput = z.infer<typeof GeneratedTradeCallOutputSchema> & { hora_call: string };


// Schema for LLM's direct output (without hora_call)
const LLMOutputSchema = GeneratedTradeCallOutputSchema.omit({ hora_call: true });

const generateTradeCallPrompt = ai.definePrompt({
  name: 'generateTradeCallPrompt',
  input: {schema: GenerateTradeCallInputSchema},
  output: {schema: LLMOutputSchema}, // LLM is expected to return this schema
  prompt: `Você é um analista de trading de criptomoedas experiente, especializado em identificar oportunidades de trade para meme coins de alta volatilidade.
Sua tarefa é gerar uma sugestão de "call" de trade completa com base nos seguintes dados de mercado fornecidos para a moeda {{{coinName}}}.

Dados da Moeda:
- Nome/Símbolo: {{{coinName}}}
- Volume nas 24h (USD): {{{volume24h}}}
- Liquidez Atual (USD): {{{liquidity}}}
- Preço Atual (USD): {{{currentPrice}}}
- Variação de Preço em 1h (%): {{{priceChange1h}}}%
- Variação de Preço em 24h (%): {{{priceChange24h}}}%
- Está em Lista "Hot"/"Trending": {{{isOnHotList}}}

Instruções para Geração da Call:
1.  **Moeda**: Use o '{{{coinName}}}' fornecido.
2.  **Entrada**: O preço de entrada ('entrada') deve ser o 'Preço Atual (USD)' fornecido. Formate-o como uma string com "$" e com 6-8 casas decimais se for menor que $0.01, ou 2-4 casas decimais caso contrário (ex: "$0.00000421" ou "$0.1234").
3.  **Alvos (Take Profit)**: Calcule **dois preços alvo (TP1 e TP2)** distintos ('alvos') que representem ganhos realistas e atraentes. Por exemplo, o primeiro alvo (TP1) pode ser +20-30% acima do preço de entrada, e o segundo alvo (TP2) +40-70% acima do preço de entrada. Cada alvo deve ser um objeto com um campo 'preco'. Formate cada 'preco' como uma string, seguindo o mesmo padrão do preço de entrada. A sua resposta para 'alvos' deve ser uma array contendo exatamente dois desses objetos.
4.  **Stop (Stop Loss)**: Calcule um preço de stop loss ('stop') que limite as perdas potenciais (ex: 10% a 20% abaixo do preço de entrada, ou um pouco mais se o risco for alto). Formate-o como o preço de entrada.
5.  **Motivo**: Crie um motivo ('motivo') conciso e convincente para a call, mencionando os fatores mais relevantes dos dados fornecidos (ex: "Volume crescente nas últimas 24h, alta liquidez e presença em lista de tendências indicam potencial de alta." ou "Forte aumento de preço em 1h e 24h com bom volume."). Se '{{{isOnHotList}}}' for verdadeiro, mencione isso.
6.  **Risco**: Classifique o risco da trade como "Baixo", "Médio" ou "Alto" ('risco'), considerando a volatilidade típica de meme coins e os dados fornecidos.

Foque em gerar calls que pareçam plausíveis e baseadas nos dados.
O campo 'alvos' deve ser um array com dois objetos, cada um contendo a chave 'preco'.
Não inclua o campo 'hora_call' na sua resposta.
`,
});

const generateTradeCallFlow = ai.defineFlow(
  {
    name: 'generateTradeCallFlow',
    inputSchema: GenerateTradeCallInputSchema,
    outputSchema: LLMOutputSchema,
  },
  async (input: GenerateTradeCallInput): Promise<LLMGeneratedTradeCallOutput> => {
    const {output} = await generateTradeCallPrompt(input);
    if (!output) {
      throw new Error("A IA não retornou uma saída para a geração da call de trade.");
    }
    return output;
  }
);

export async function generateTradeCall(input: GenerateTradeCallInput): Promise<GeneratedTradeCallOutput> {
  const result = await generateTradeCallFlow(input);
  return {
    ...result,
    hora_call: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC',
  };
}
