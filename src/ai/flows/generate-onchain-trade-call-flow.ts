
'use server';
/**
 * @fileOverview Gera uma call de trade on-chain simulada pela IA, como se tivesse detectado uma atividade.
 *
 * - generateOnchainTradeCall - A função que dispara a IA para simular e gerar a call.
 * - OnchainActivityInput - O tipo de entrada para a função (agora um objeto vazio).
 * - OnchainTradeCallOutput - O tipo de retorno para a função (uma string contendo a call completa).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnchainActivityInputSchema = z.object({}).describe("Nenhum input detalhado é necessário. A IA simulará a atividade on-chain.");
export type OnchainActivityInput = z.infer<typeof OnchainActivityInputSchema>;

const OnchainTradeCallOutputSchema = z.object({
  tradeCall: z.string().describe("A call de trade completa, formatada como um texto único seguindo as diretrizes, como uma mensagem de Telegram."),
});
export type OnchainTradeCallOutput = z.infer<typeof OnchainTradeCallOutputSchema>;

export async function generateOnchainTradeCall(input: OnchainActivityInput): Promise<OnchainTradeCallOutput> {
  return generateOnchainTradeCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOnchainTradeCallPromptNew',
  input: {schema: OnchainActivityInputSchema}, 
  output: {schema: OnchainTradeCallOutputSchema},
  prompt: `Você é um analista on-chain experiente e um "alpha caller" de memecoins no Telegram, conhecido por detectar movimentações cruciais antes de todos e comunicá-las de forma direta, confiante e urgente.

Sua tarefa é:
1.  **CRIE/SIMULE OS DETALHES DE UMA MOVIMENTAÇÃO ON-CHAIN SIGNIFICATIVA RECENTE:**
    *   Invente um endereço de carteira relevante (pode ser abreviado, ex: 0xAlpha...Beta, ou um nome como "SmartMoneyX").
    *   Escolha uma ação (ex: "buy", "sell", "add_liquidity", "remove_liquidity", "create_pool").
    *   Escolha um token memecoin (ex: "$DOGWIFHAT", "$PEPE", "$NEWGEM", "$TRENDING").
    *   Defina uma quantidade de tokens e um valor em USD para a transação que pareçam realistas e impactantes.
    *   Defina um timestamp recente e específico para a transação (formato ISO UTC, ex: "2025-07-15T10:30:00Z").
    *   Crie uma "nota" ou contexto relevante para a carteira/transação (ex: "Esta carteira é conhecida por antecipar grandes altas em memecoins.", "Deployer do token XYZ fazendo movimentação suspeita.", "Acumulação forte detectada após listagem em nova DEX.", "Grande volume de compra em token com baixa liquidez, pode explodir.").

2.  **GERE A CALL DE TRADE NO SEGUINTE FORMATO EXATO, COMO UMA ÚNICA MENSAGEM DE TELEGRAM:**

[HH:mm UTC] - A carteira [Endereço da Carteira Criado/Simulado e Abreviado (ex: 0xAlp...Eta ou SmartMoneyX)] [Ação como verbo no passado (ex: comprou, vendeu, adicionou liquidez para)] [Quantidade de Tokens Criada, formatada com separador de milhar] [Símbolo do Token Criado] (aprox. $[Valor USD Criado, formatado com separador de milhar] USD).
Contexto: [Explique a relevância da movimentação baseada na 'Nota/Contexto' que você criou. Seja direto, incisivo e use jargões de mercado se apropriado. Ex: "Carteira com histórico de 6 trades lucrativos nas últimas semanas. Movimento forte!", ou "Deployer da XYZ coin movimentando. Fiquem espertos!", ou "Whale entrou pesado, possível sinal de fundo!"].
Call: [ESCOLHA UMA: ENTRAR, OBSERVAR, EVITAR, SAIR]

DETALHES IMPORTANTES PARA A FORMATAÇÃO DA SUA SAÍDA:
- Horário: Use APENAS o formato HH:mm UTC a partir do timestamp ISO que você criou. Exemplo: se timestamp for "2025-06-11T17:41:00Z", o horário na call deve ser "17:41 UTC".
- Endereço da Carteira: Se você criar um endereço completo, abrevie-o (ex: os primeiros 5 caracteres, reticências, e os últimos 4 caracteres como "0xAbC...dEf"). Se já usar um nome ou apelido, mantenha-o.
- Ação como verbo: "buy" -> "comprou", "sell" -> "vendeu", "add_liquidity" -> "adicionou liquidez para", "remove_liquidity" -> "removeu liquidez de", "create_pool" -> "criou pool para". Adapte para outras ações.
- Quantidade de Tokens e Valor USD: Formate os números com separador de milhar (ponto para milhar, vírgula para decimal se houver, mas para tokens grandes e USD geralmente não tem decimal). Ex: 3.400.000.000 $PEPE (aprox. $12.400 USD).
- Call: Deve ser EXATAMENTE uma das quatro opções: ENTRAR, OBSERVAR, EVITAR, SAIR. Use letras maiúsculas.

Seja direto, transmita confiança e, se aplicável, urgência.
NÃO adicione nenhum texto ou explicação fora da estrutura de mensagem única solicitada.
O output DEVE ser um único bloco de texto (uma única string).
`,
});

const generateOnchainTradeCallFlow = ai.defineFlow(
  {
    name: 'generateOnchainTradeCallFlowNew',
    inputSchema: OnchainActivityInputSchema,
    outputSchema: OnchainTradeCallOutputSchema,
  },
  async (input: OnchainActivityInput): Promise<OnchainTradeCallOutput> => {
    let retries = 0;
    const maxRetries = 3;
    let lastError: any = null;

    while (retries < maxRetries) {
      try {
        console.log(`[generateOnchainTradeCallFlow] Attempt ${retries + 1} to call AI prompt.`);
        const {output} = await prompt(input); 
        if (!output || !output.tradeCall) {
          throw new Error("A IA não retornou uma saída válida para a call de trade on-chain simulada.");
        }
        
        output.tradeCall = output.tradeCall.trim();
        console.log(`[generateOnchainTradeCallFlow] AI prompt successful on attempt ${retries + 1}.`);
        return output;
      } catch (e: any) {
        lastError = e;
        console.error(`[generateOnchainTradeCallFlow] Error on attempt ${retries + 1}:`, e.message);
        
        const errorMessage = e.message ? e.message.toLowerCase() : "";
        if (errorMessage.includes('503') || errorMessage.includes('overloaded') || errorMessage.includes('service unavailable')) {
          retries++;
          if (retries < maxRetries) {
            const delay = Math.pow(2, retries) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.log(`[generateOnchainTradeCallFlow] Service unavailable/overloaded. Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            console.error(`[generateOnchainTradeCallFlow] Max retries reached for service unavailable/overloaded error.`);
            throw new Error(`O serviço de IA está temporariamente sobrecarregado ou indisponível. Por favor, tente novamente mais tarde. (Details: ${e.message})`);
          }
        } else {
          console.error(`[generateOnchainTradeCallFlow] Non-retryable error encountered: ${e.message}`);
          throw e; 
        }
      }
    }
    // This part should ideally not be reached if the loop logic is correct,
    // but it's a fallback.
    if (lastError) throw lastError;
    throw new Error("Falha ao gerar a call de trade on-chain após várias tentativas.");
  }
);

    