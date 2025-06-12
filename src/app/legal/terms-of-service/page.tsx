
// src/app/legal/terms-of-service/page.tsx
import { AppLogo } from "@/components/shared/AppLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
  const lastUpdated = "15 de Julho de 2024"; // Atualize esta data

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Termos de Serviço</CardTitle>
          <p className="text-sm text-muted-foreground">Última atualização: {lastUpdated}</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-primary">1. Aceitação dos Termos</h2>
                <p>
                  Bem-vindo ao MemeTrade Pro ("Serviço", "Nós", "Nosso"). Ao acessar ou usar nosso serviço, você concorda em cumprir e estar vinculado a estes Termos de Serviço ("Termos"). Se você não concordar com estes Termos, não deverá acessar ou usar o Serviço.
                </p>
                <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                  <strong>AVISO:</strong> Este é um documento modelo e não constitui aconselhamento jurídico. Você deve consultar um profissional jurídico para garantir que seus Termos de Serviço sejam apropriados para o seu negócio e jurisdição.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">2. Descrição dos Serviços</h2>
                <p>
                  O MemeTrade Pro fornece alertas e informações relacionadas ao trading de meme coins e outras criptomoedas. Nossos serviços são apenas para fins informativos e educacionais. Não fornecemos aconselhamento financeiro, de investimento, jurídico, fiscal ou qualquer outro tipo de aconselhamento profissional.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">3. Riscos do Trading de Criptomoedas</h2>
                <p>
                  Você reconhece e concorda que o trading de criptomoedas, especialmente meme coins, é altamente volátil e arriscado. Os preços podem flutuar significativamente em curtos períodos, e você pode perder todo o seu capital investido. Você é o único responsável por suas decisões de investimento e por qualquer perda resultante. Não garantimos lucros ou qualquer resultado específico.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">4. Elegibilidade do Usuário</h2>
                <p>
                  Para usar nosso Serviço, você deve ter pelo menos 18 anos de idade ou a maioridade legal em sua jurisdição. Ao usar o Serviço, você declara e garante que atende a esses requisitos de elegibilidade.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">5. Conduta do Usuário</h2>
                <p>
                  Você concorda em usar o Serviço apenas para fins legais e de acordo com estes Termos. Você não deve usar o Serviço:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>De qualquer forma que viole qualquer lei ou regulamento aplicável.</li>
                  <li>Para se envolver em qualquer atividade fraudulenta ou enganosa.</li>
                  <li>Para transmitir qualquer material que seja difamatório, obsceno, ofensivo ou de outra forma censurável.</li>
                  <li>Para interferir ou interromper a integridade ou o desempenho do Serviço.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">6. Propriedade Intelectual</h2>
                <p>
                  O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do MemeTrade Pro e seus licenciadores. O Serviço é protegido por direitos autorais, marcas registradas e outras leis.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">7. Isenção de Garantias</h2>
                <p>
                  O Serviço é fornecido "COMO ESTÁ" e "CONFORME DISPONÍVEL", sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que o Serviço será ininterrupto, seguro ou livre de erros.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">8. Limitação de Responsabilidade</h2>
                <p>
                  Em nenhuma circunstância o MemeTrade Pro, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, ágio ou outras perdas intangíveis, resultantes de (i) seu acesso ou uso ou incapacidade de acessar ou usar o Serviço; (ii) qualquer conduta ou conteúdo de terceiros no Serviço; (iii) qualquer conteúdo obtido do Serviço; e (iv) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo, seja com base em garantia, contrato, ato ilícito (incluindo negligência) ou qualquer outra teoria legal, quer tenhamos sido informados ou não da possibilidade de tais danos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">9. Modificações nos Termos</h2>
                <p>
                  Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso exclusivo critério.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">10. Lei Aplicável</h2>
                <p>
                  Estes Termos serão regidos e interpretados de acordo com as leis de [Sua Jurisdição], sem consideração aos seus conflitos de disposições legais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">11. Contato</h2>
                <p>
                  Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em: [Seu Email de Contato para Assuntos Legais].
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Button variant="link" asChild className="mt-8">
        <Link href="/">Voltar para a Página Inicial</Link>
      </Button>
    </div>
  );
}
