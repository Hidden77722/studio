
'use server';
/**
 * @fileOverview Analisa dados de mercado pré-filtrados de múltiplas moedas,
 * escolhe a mais promissora e gera uma call de trade completa.
 *
 * - generateTradeCall - A função que gera a call de trade.
 * - GenerateTradeCallInput - O tipo de entrada para a função generateTradeCall.
 * - GeneratedTradeCallOutput - O tipo de retorno para a função generateTradeCall.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema de entrada: espera uma string com dados de mercado pré-filtrados
const GenerateTradeCallInputSchema = z.object({
  marketAnalysisData: z.string().describe(
    'Uma string contendo dados de mercado pré-filtrados de várias moedas promissoras. Exemplo: "- MOEDA_A: volume $X, liquidez $Y, +Z% 1h, +W% 24h, preço $P\\n- MOEDA_B: volume $X2, liquidez $Y2, +Z2% 1h, +W2% 24h, preço $P2"'
  ),
});
export type GenerateTradeCallInput = z.infer<typeof GenerateTradeCallInputSchema>;

// Schema de saída: a call de trade gerada ou indicação de nenhuma call
const GeneratedTradeCallOutputSchema = z.object({
  moeda: z.string().describe('O nome da moeda escolhida para a call, ou "Nenhuma call no momento" se nenhuma for considerada promissora.'),
  hora_call: z.string().optional().describe('A hora ideal de entrada sugerida em formato UTC (ex: "14:30 UTC"). Opcional se nenhuma call for recomendada.'),
  entrada: z.string().optional().describe('O preço de entrada sugerido para a moeda escolhida, formatado como string com "$" (ex: "$0.00000421"). Opcional se nenhuma call for recomendada.'),
  alvos: z.array(
    z.object({
      preco: z.string().describe("Preço alvo para take profit, formatado como string com '$'."),
    })
  ).length(2).optional().describe("Uma lista contendo exatamente dois alvos de lucro (take profit) para a moeda escolhida. Opcional se nenhuma call for recomendada."),
  stop: z.string().optional().describe('O preço de stop loss sugerido para a moeda escolhida, formatado como string com "$" (ex: "$0.00000390"). Opcional se nenhuma call for recomendada.'),
  motivo: z.string().optional().describe('Um motivo conciso e técnico para a call de trade da moeda escolhida, baseado nos dados de mercado fornecidos. Opcional se nenhuma call for recomendada.'),
  risco: z.enum(["Baixo", "Médio", "Alto", "Nenhum"]).optional().describe("A classificação de risco da call de trade para a moeda escolhida (Baixo, Médio, ou Alto). 'Nenhum' se nenhuma call for recomendada.")
});
export type GeneratedTradeCallOutput = z.infer<typeof GeneratedTradeCallOutputSchema>;


const generateTradeCallPrompt = ai.definePrompt({
  name: 'generateTradeCallPrompt',
  input: {schema: GenerateTradeCallInputSchema},
  output: {schema: GeneratedTradeCallOutputSchema},
  prompt: `Você é um analista de criptoativos extremamente experiente, focado exclusivamente em meme coins de alta volatilidade.
Seu trabalho é identificar oportunidades de entrada com alta probabilidade de lucro, usando dados como volume, liquidez, tendência de mercado e hype social (mesmo que indiretamente).

Com base nos dados de moedas pré-filtradas e promissoras abaixo, sua tarefa é:
1.  Analisar cuidadosamente cada moeda listada.
2.  **Escolher apenas 1 (uma) moeda** que você considera ter o MAIOR potencial de lucro imediato.
3.  Se NENHUMA moeda parecer uma boa oportunidade no momento, retorne "Nenhuma call no momento" no campo 'moeda' e deixe os outros campos opcionais vazios ou com valores indicativos de nenhuma call.

Se você escolher uma moeda, gere uma call de trade completa para ELA, com as seguintes informações:
-   **moeda**: Nome da moeda escolhida.
-   **hora_call**: Hora ideal para entrada, em formato UTC (ex: "16:30 UTC"). Considere o momento atual da análise.
-   **entrada**: Preço de entrada sugerido para a moeda escolhida. Use o preço fornecido nos dados como base. Formate como string com "$" e casas decimais apropriadas para meme coins (ex: "$0.00000421").
-   **alvos**: Exatamente **dois** preços alvo (take profit) realistas e atraentes. Por exemplo, TP1 +20-50% e TP2 +50-100% acima da entrada. Cada alvo deve ser um objeto com um campo 'preco' (string formatada como a entrada).
-   **stop**: Preço de stop loss realista, limitando perdas potenciais (ex: 10-20% abaixo da entrada). Formate como a entrada.
-   **motivo**: Motivo claro e técnico da entrada (ex: "Forte rompimento de resistência em X, volume crescente Y, e menções em alta indicam potencial de Z%."). Seja direto e convincente.
-   **risco**: Classificação do risco ("Baixo", "Médio", "Alto") para esta call específica.

Dados das Moedas Pré-filtradas:
{{{marketAnalysisData}}}

Instruções Adicionais:
-   Priorize oportunidades com real chance de acerto, não apenas hype vazio.
-   Seja decisivo na escolha da moeda. Se mais de uma parecer boa, escolha a melhor.
-   Certifique-se de que os preços de entrada, alvos e stop loss sejam consistentes e façam sentido em relação ao preço atual da moeda fornecido nos dados.
-   O campo 'alvos' deve ser um array com dois objetos, cada um contendo a chave 'preco'.
`,
});

const generateTradeCallFlow = ai.defineFlow(
  {
    name: 'generateTradeCallFlow',
    inputSchema: GenerateTradeCallInputSchema,
    outputSchema: GeneratedTradeCallOutputSchema,
  },
  async (input: GenerateTradeCallInput): Promise<GeneratedTradeCallOutput> => {
    const {output} = await generateTradeCallPrompt(input);
    if (!output) {
      throw new Error("A IA não retornou uma saída para a geração da call de trade.");
    }
    // Se a IA indicar "Nenhuma call no momento", os campos opcionais podem estar ausentes.
    // A validação do Zod schema já cuida disso.
    return output;
  }
);

export async function generateTradeCall(input: GenerateTradeCallInput): Promise<GeneratedTradeCallOutput> {
  // A hora da call agora é esperada diretamente da IA.
  // A função wrapper simplesmente chama o fluxo.
  return generateTradeCallFlow(input);
}

