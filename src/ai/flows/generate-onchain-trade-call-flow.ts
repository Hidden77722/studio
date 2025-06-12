
'use server';
/**
 * @fileOverview Gera uma call de trade on-chain baseada em dados de atividade de carteira.
 *
 * - generateOnchainTradeCall - A função que processa a atividade e gera a call.
 * - OnchainActivityInput - O tipo de entrada para a função.
 * - OnchainTradeCallOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format } from 'date-fns'; // Para formatar o timestamp

const OnchainActivityInputSchema = z.object({
  wallet: z.string().describe('O endereço da carteira que realizou a ação.'),
  action: z.string().describe('O tipo de ação (ex: "buy", "sell", "add_liquidity").'),
  token: z.string().describe('O símbolo do token (ex: "$PEPE").'),
  amount_tokens: z.number().describe('A quantidade de tokens envolvida na transação.'),
  amount_usd: z.number().describe('O valor aproximado em USD da transação.'),
  timestamp: z.string().datetime().describe('O timestamp da transação no formato ISO (UTC).'),
  contract: z.string().optional().describe('O endereço do contrato do token, se aplicável.'),
  note: z.string().optional().describe('Uma nota ou contexto adicional sobre a carteira ou transação.'),
});
export type OnchainActivityInput = z.infer<typeof OnchainActivityInputSchema>;

const OnchainTradeCallOutputSchema = z.object({
  horario_utc: z.string().describe('O horário exato da movimentação, formatado como DD/MM/YYYY HH:mm UTC.'),
  tipo_acao: z.string().describe('Descrição concisa da ação (ex: COMPRA DE $PEPE).'),
  quantidade_tokens_usd: z.string().describe('A quantidade de tokens e o valor em USD (ex: 3.400.000.000 $PEPE (aprox. $12.400 USD)).'),
  justificativa: z.string().describe('Análise concisa e direta sobre a relevância da movimentação, citando a nota se aplicável.'),
  sugestao_acao: z.enum(["ENTRAR", "OBSERVAR", "EVITAR", "SAIR"]).describe('A sugestão de ação (ENTRAR, OBSERVAR, EVITAR, SAIR).'),
});
export type OnchainTradeCallOutput = z.infer<typeof OnchainTradeCallOutputSchema>;

export async function generateOnchainTradeCall(input: OnchainActivityInput): Promise<OnchainTradeCallOutput> {
  return generateOnchainTradeCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOnchainTradeCallPrompt',
  input: {schema: OnchainActivityInputSchema},
  output: {schema: OnchainTradeCallOutputSchema},
  prompt: `Você é um analista on-chain experiente, especializado em memecoins e conhecido por suas calls de trade "alpha" diretas e confiantes, como as encontradas em canais de Telegram.
Analise os seguintes dados de atividade on-chain:

Wallet: {{{wallet}}}
Ação: {{{action}}}
Token: {{{token}}}
Quantidade de Tokens: {{{amount_tokens}}}
Valor em USD: {{{amount_usd}}}
Timestamp (UTC): {{{timestamp}}}
{{#if contract}}Contrato: {{{contract}}}{{/if}}
{{#if note}}Nota Adicional: {{{note}}}{{/if}}

Com base exclusivamente nesses dados, gere uma call de trade no seguinte formato. Seja direto, use jargões de mercado se apropriado (ex: "whale entrou pesado"), e transmita confiança.

Para o campo 'horario_utc', formate o timestamp '{{{timestamp}}}' como DD/MM/YYYY HH:mm UTC.
Para o campo 'tipo_acao', use letras maiúsculas e seja conciso, por exemplo, se a ação é "buy" e o token é "$PEPE", o tipo de ação deve ser "COMPRA DE $PEPE". Se a ação for "sell", "VENDA DE $PEPE". Se for "add_liquidity", "ADIÇÃO DE LP PARA $PEPE". Adapte para outras ações.
Para o campo 'quantidade_tokens_usd', use o formato: "{{{amount_tokens}}} {{{token}}} (aprox. \${{{amount_usd}}} USD)".
Para o campo 'justificativa', forneça uma análise concisa e direta sobre por que essa movimentação é relevante. Se houver uma 'Nota Adicional', incorpore-a na justificativa.
Para o campo 'sugestao_acao', escolha UMA das seguintes opções: ENTRAR, OBSERVAR, EVITAR, SAIR. Baseie sua decisão na ação ("buy" geralmente sugere ENTRAR ou OBSERVAR, "sell" pode sugerir OBSERVAR, EVITAR ou SAIR dependendo do contexto da nota), no histórico da carteira (se fornecido na nota), e no contexto geral de memecoins. Se a nota mencionar que a carteira tem um bom histórico de trades lucrativos e a ação é de compra, "ENTRAR" é uma boa sugestão.

Não adicione nenhum texto ou explicação fora da estrutura de output solicitada.
`,
});

const generateOnchainTradeCallFlow = ai.defineFlow(
  {
    name: 'generateOnchainTradeCallFlow',
    inputSchema: OnchainActivityInputSchema,
    outputSchema: OnchainTradeCallOutputSchema,
  },
  async (input: OnchainActivityInput): Promise<OnchainTradeCallOutput> => {
    // Formatar o timestamp antes de enviar para a IA, para garantir consistência se a IA não o fizer.
    // No entanto, o prompt pede para a IA formatar, vamos confiar nisso por enquanto.
    // Se a IA falhar em formatar consistentemente, podemos fazer aqui:
    // input.timestamp = format(new Date(input.timestamp), "dd/MM/yyyy HH:mm 'UTC'");

    const {output} = await prompt(input);
    if (!output) {
      throw new Error("A IA não retornou uma saída para a call de trade on-chain.");
    }
    // A IA deve cuidar da formatação do horário, mas podemos validar/reformatar aqui se necessário.
    // Por exemplo, se a IA retornar um timestamp ISO no campo horario_utc, podemos reformatar:
    try {
        const parsedDate = new Date(output.horario_utc);
        if (isNaN(parsedDate.getTime())) {
            // Se não for uma data válida, tentamos formatar o input.timestamp
            output.horario_utc = format(new Date(input.timestamp), "dd/MM/yyyy HH:mm 'UTC'");
        } else {
             // Se a IA já retornou uma data válida, vamos garantir que está no formato certo
             output.horario_utc = format(parsedDate, "dd/MM/yyyy HH:mm 'UTC'");
        }
    } catch (e) {
        // Fallback para o timestamp de entrada se a formatação falhar
        output.horario_utc = format(new Date(input.timestamp), "dd/MM/yyyy HH:mm 'UTC'");
    }

    // Assegurar que a quantidade tenha o formato correto se a IA não o fizer
    const expectedQuantityString = `${input.amount_tokens.toLocaleString('de-DE')} ${input.token} (aprox. $${input.amount_usd.toLocaleString('de-DE', {minimumFractionDigits: 0, maximumFractionDigits: 0})} USD)`;
    if (output.quantidade_tokens_usd !== expectedQuantityString) {
        // Poderíamos forçar a formatação aqui, mas vamos confiar na IA por enquanto
        // ou ajustar o prompt para ser mais específico sobre formatação de números.
        // Para este exemplo, vamos deixar a IA tentar.
    }


    return output;
  }
);

    