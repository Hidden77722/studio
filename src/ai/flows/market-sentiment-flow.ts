
'use server';
/**
 * @fileOverview Provides an AI-generated market sentiment analysis for a meme coin, classifying its hype potential.
 *
 * - analyzeMarketSentiment - A function that generates the sentiment analysis.
 * - MarketSentimentInput - The input type for the analyzeMarketSentiment function.
 * - MarketSentimentOutput - The return type for the analyzeMarketSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { MarketSentimentInput as InputType, MarketSentimentOutput as OutputType, HypePotential} from '@/lib/types';

export const MarketSentimentInputSchema = z.object({
  coinName: z.string().describe('The name of the meme coin.'),
  description: z.string().describe('A brief description or context of the meme coin.'),
  volume24h: z.number().describe('The trading volume in the last 24 hours (USD).'),
  priceChange24h: z.number().describe('The price change percentage in the last 24 hours (e.g., 25.5 for +25.5%).'),
});
export type MarketSentimentInput = z.infer<typeof MarketSentimentInputSchema>;

export const MarketSentimentOutputSchema = z.object({
  hypePotential: z.enum(["Alta", "Moderada", "Baixa"]).describe('The classified hype potential of the coin.'),
  justification: z.string().describe('The justification for the classified hype potential.'),
});
export type MarketSentimentOutput = z.infer<typeof MarketSentimentOutputSchema>;

export async function analyzeMarketSentiment(input: MarketSentimentInput): Promise<MarketSentimentOutput> {
  return marketSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketSentimentPrompt',
  input: {schema: MarketSentimentInputSchema},
  output: {schema: MarketSentimentOutputSchema},
  prompt: `Você é um analista de sentimento de mercado para criptomoedas, especializado em meme coins.
Seu objetivo é classificar o potencial de "hype" (entusiasmo e potencial de viralização) de uma moeda com base nos dados fornecidos.

Dados da Moeda:
- Nome: {{{coinName}}}
- Descrição/Contexto: {{{description}}}
- Volume nas últimas 24h (USD): {{{volume24h}}}
- Variação de Preço nas últimas 24h (%): {{{priceChange24h}}}%

Com base nesses dados, classifique o potencial de hype da moeda como: Alta, Moderada ou Baixa.
Forneça uma justificativa concisa para sua classificação, explicando como os dados informam sua decisão.

Por exemplo, um volume muito alto e uma grande variação positiva de preço geralmente indicam um hype alto. Uma descrição que mencione uma comunidade forte ou um meme popular também pode contribuir para um hype alto. Volume baixo ou variação negativa podem indicar hype baixo.
Considere a combinação dos fatores.
`,
});

const marketSentimentFlow = ai.defineFlow(
  {
    name: 'marketSentimentFlow',
    inputSchema: MarketSentimentInputSchema,
    outputSchema: MarketSentimentOutputSchema,
  },
  async (input: InputType): Promise<OutputType> => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("A IA não retornou uma saída para a análise de sentimento.");
    }
    // Assegurar que o tipo HypePotential está correto vindo do LLM,
    // embora o Zod enum já faça essa validação.
    const validHypePotentials: HypePotential[] = ["Alta", "Moderada", "Baixa"];
    if (!validHypePotentials.includes(output.hypePotential as HypePotential)) {
        // Default to "Moderada" or handle error if LLM output is not one of the enum values
        console.warn(`Potencial de hype inválido recebido: ${output.hypePotential}. Usando "Moderada" como padrão.`);
        return { ...output, hypePotential: "Moderada" as HypePotential };
    }
    return output as OutputType;
  }
);
