
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
  moeda: z.string().describe('The name or symbol of the coin for the call.'),
  // hora_call: z.string().describe('The time the call was generated, e.g., "13:42 UTC". This will be added by the system.'), // LLM should not generate this
  entrada: z.string().describe('The suggested entry price, formatted as a string with a "$" prefix and appropriate decimal places (e.g., "$0.00000421"). This should be very close to the currentPrice input.'),
  alvo: z.string().describe('The suggested target (take profit) price, formatted as a string with a "$" prefix. This should be plausibly higher than the entry price (e.g. 20-50% higher).'),
  stop: z.string().describe('The suggested stop-loss price, formatted as a string with a "$" prefix. This should be plausibly lower than the entry price (e.g. 10-20% lower).'),
  motivo: z.string().describe('A concise reason for the trade call, based on the provided market data (volume, liquidity, price changes, hot list status).'),
});
// Output type without hora_call for the LLM, as it will be added by the wrapper
type LLMGeneratedTradeCallOutput = Omit<z.infer<typeof GeneratedTradeCallOutputSchema>, 'hora_call'>;
export type GeneratedTradeCallOutput = z.infer<typeof GeneratedTradeCallOutputSchema>;


export async function generateTradeCall(input: GenerateTradeCallInput): Promise<GeneratedTradeCallOutput> {
  const result = await generateTradeCallFlow(input);
  return {
    ...result,
    hora_call: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC',
  };
}

const prompt = ai.definePrompt({
  name: 'generateTradeCallPrompt',
  input: {schema: GenerateTradeCallInputSchema},
  output: {schema: GeneratedTradeCallOutputSchema.omit({ hora_call: true })}, // LLM doesn't generate hora_call
  prompt: `Você é um analista de trading de criptomoedas experiente, especializado em identificar oportunidades de trade para meme coins.
Sua tarefa é gerar uma sugestão de "call" de trade (entrada, alvo, stop) com base nos seguintes dados de mercado fornecidos para a moeda {{{coinName}}}.

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
3.  **Alvo (Take Profit)**: Calcule um preço alvo ('alvo') que represente um ganho realista e atraente (ex: 20% a 50% acima do preço de entrada). Formate-o como o preço de entrada.
4.  **Stop (Stop Loss)**: Calcule um preço de stop loss ('stop') que limite as perdas potenciais (ex: 10% a 20% abaixo do preço de entrada). Formate-o como o preço de entrada.
5.  **Motivo**: Crie um motivo ('motivo') conciso e convincente para a call, mencionando os fatores mais relevantes dos dados fornecidos (ex: "Volume crescente nas últimas 24h, alta liquidez e presença em lista de tendências indicam potencial de alta." ou "Forte aumento de preço em 1h e 24h com bom volume."). Se 'isOnHotList' for verdadeiro, mencione isso.

Foque em gerar calls que pareçam plausíveis e baseadas nos dados.
Não inclua o campo 'hora_call' na sua resposta.
`,
});

const generateTradeCallFlow = ai.defineFlow(
  {
    name: 'generateTradeCallFlow',
    inputSchema: GenerateTradeCallInputSchema,
    outputSchema: GeneratedTradeCallOutputSchema.omit({ hora_call: true }),
  },
  async (input: GenerateTradeCallInput): Promise<LLMGeneratedTradeCallOutput> => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("A IA não retornou uma saída para a geração da call de trade.");
    }
    return output;
  }
);

