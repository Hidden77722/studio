
'use server';
/**
 * @fileOverview Gera uma call de trade on-chain baseada em dados de atividade de carteira.
 *
 * - generateOnchainTradeCall - A função que processa a atividade e gera a call.
 * - OnchainActivityInput - O tipo de entrada para a função.
 * - OnchainTradeCallOutput - O tipo de retorno para a função (uma string contendo a call completa).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format, parseISO } from 'date-fns'; // Para formatar o timestamp

const OnchainActivityInputSchema = z.object({
  wallet: z.string().describe('O endereço da carteira que realizou a ação (pode ser completo ou já abreviado).'),
  action: z.string().describe('O tipo de ação (ex: "buy", "sell", "add_liquidity", "remove_liquidity", "create_pool").'),
  token: z.string().describe('O símbolo do token (ex: "$PEPE", "$WIF").'),
  amount_tokens: z.number().describe('A quantidade de tokens envolvida na transação.'),
  amount_usd: z.number().describe('O valor aproximado em USD da transação.'),
  timestamp: z.string().datetime({ message: "Timestamp deve ser uma string ISO 8601 válida (UTC)" }).describe('O timestamp da transação no formato ISO UTC (ex: "2025-06-11T17:41:00Z").'),
  contract: z.string().optional().describe('O endereço do contrato do token, se aplicável.'),
  note: z.string().optional().describe('Uma nota ou contexto adicional sobre a carteira ou transação (ex: histórico lucrativo, é deployer, etc.).'),
});
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
  prompt: `Você é um analista on-chain experiente, focado em memecoins e conhecido por suas calls de trade "alpha" diretas, confiantes e urgentes, como as de um canal de Telegram.
Analise os seguintes dados de atividade on-chain:

Wallet: {{{wallet}}}
Ação: {{{action}}}
Token: {{{token}}}
Quantidade de Tokens: {{{amount_tokens}}}
Valor em USD: {{{amount_usd}}}
Timestamp (UTC ISO): {{{timestamp}}}
{{#if contract}}Contrato: {{{contract}}}{{/if}}
{{#if note}}Nota/Contexto: {{{note}}}{{/if}}

Gere uma call de trade no seguinte formato EXATO, como uma única mensagem:

[HH:mm UTC] - A carteira [Endereço da Carteira Abreviado (ex: 0xAbC...dEf)] [Ação como verbo no passado (ex: comprou, vendeu, adicionou liquidez para)] [Quantidade formatada com separador de milhar] [Símbolo do Token] (aprox. $[Valor USD formatado com separador de milhar] USD).
Contexto: [Explique a relevância da movimentação baseada na 'Nota/Contexto'. Seja direto e incisivo. Ex: "Carteira com histórico de 6 trades lucrativos nas últimas semanas. Movimento forte!", ou "Deployer da XYZ coin movimentando. Fiquem espertos!"].
Call: [ESCOLHA UMA: ENTRAR, OBSERVAR, EVITAR, SAIR]

DETALHES IMPORTANTES PARA A FORMATAÇÃO:
- Horário: Use APENAS o formato HH:mm UTC a partir do timestamp ISO fornecido. Exemplo: se timestamp for "2025-06-11T17:41:00Z", o horário na call deve ser "17:41 UTC".
- Endereço da Carteira: Se o campo 'wallet' for um endereço completo, abrevie-o (ex: os primeiros 5 caracteres, reticências, e os últimos 4 caracteres como "0xAbC...dEf"). Se já estiver abreviado, use-o como está.
- Ação como verbo: "buy" -> "comprou", "sell" -> "vendeu", "add_liquidity" -> "adicionou liquidez para", "remove_liquidity" -> "removeu liquidez de", "create_pool" -> "criou pool para". Adapte para outras ações.
- Quantidade de Tokens e Valor USD: Formate os números com separador de milhar (ponto para milhar, vírgula para decimal se houver, mas para tokens grandes e USD geralmente não tem decimal). Ex: 3.400.000.000 $PEPE (aprox. $12.400 USD).
- Call: Deve ser EXATAMENTE uma das quatro opções: ENTRAR, OBSERVAR, EVITAR, SAIR. Use letras maiúsculas.

Seja direto, use jargões de mercado se apropriado (ex: "whale entrou pesado", "sinal claro"), e transmita confiança e, se aplicável, urgência.
NÃO adicione nenhum texto ou explicação fora da estrutura de mensagem única solicitada.
O output DEVE ser um único bloco de texto.
`,
});

const generateOnchainTradeCallFlow = ai.defineFlow(
  {
    name: 'generateOnchainTradeCallFlowNew',
    inputSchema: OnchainActivityInputSchema,
    outputSchema: OnchainTradeCallOutputSchema,
  },
  async (input: OnchainActivityInput): Promise<OnchainTradeCallOutput> => {
    // Validação e possível formatação do timestamp de entrada, se necessário,
    // embora o prompt instrua a IA a lidar com isso.
    try {
      parseISO(input.timestamp); // Verifica se é um ISO válido
    } catch (e) {
      throw new Error("Timestamp inválido fornecido. Deve ser uma string ISO 8601 UTC.");
    }

    const {output} = await prompt(input);
    if (!output || !output.tradeCall) {
      throw new Error("A IA não retornou uma saída válida para a call de trade on-chain.");
    }
    
    // Pequena limpeza para garantir que não haja espaços extras no início/fim.
    output.tradeCall = output.tradeCall.trim();

    return output;
  }
);

    