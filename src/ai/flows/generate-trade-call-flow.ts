
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
    -   **motivo**: Motivo claro, técnico e convincente da entrada (ex: "Forte rompimento de resistência em X, volume crescente Y, e menções em alta indicam potencial de Z%.").
    -   **risco**: Classificação do risco ("Baixo", "Médio", "Alto") para esta call específica.

🔍 **Lista de moedas disponíveis:**
{{{marketAnalysisData}}}

Instruções Importantes:
- Se NENHUMA moeda na lista parecer uma boa oportunidade no momento, no campo 'moeda' retorne "Nenhuma call no momento" e os outros campos podem ser omitidos ou conter valores indicativos de nenhuma call (ex: risco: "Nenhum").
- Priorize oportunidades com real chance de acerto, não apenas hype vazio.
- Seja decisivo na escolha da moeda. Se mais de uma parecer boa, escolha a melhor.
- Certifique-se de que os preços de entrada, alvos e stop loss sejam consistentes e façam sentido em relação ao preço atual da moeda fornecido nos dados de entrada.
- O campo 'alvos' deve ser um array com exatamente dois objetos, cada um contendo a chave 'preco'.
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
    return output;
  }
);

export async function generateTradeCall(input: GenerateTradeCallInput): Promise<GeneratedTradeCallOutput> {
  return generateTradeCallFlow(input);
}
