// src/app/legal/privacy-policy/page.tsx
import { AppLogo } from "@/components/shared/AppLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  const lastUpdated = "15 de Julho de 2024"; // Atualize esta data

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Política de Privacidade</CardTitle>
          <p className="text-sm text-muted-foreground">Última atualização: {lastUpdated}</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-primary">1. Introdução</h2>
                <p>
                  Esta Política de Privacidade descreve como o MemeTrade Pro ("Nós", "Nosso") coleta, usa e protege suas informações pessoais quando você usa nosso site e serviços ("Serviço"). Estamos comprometidos em proteger sua privacidade.
                </p>
                 <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                  <strong>AVISO:</strong> Este é um documento modelo e não constitui aconselhamento jurídico. Você deve consultar um profissional jurídico para garantir que sua Política de Privacidade seja apropriada para o seu negócio, esteja em conformidade com as leis aplicáveis (como GDPR, CCPA, etc.) e cubra todas as suas práticas de dados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">2. Informações que Coletamos</h2>
                <p>Podemos coletar os seguintes tipos de informações:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    <strong>Informações Pessoais de Identificação:</strong> Nome, endereço de e-mail, informações de senha (armazenadas de forma segura e hash).
                  </li>
                  <li>
                    <strong>Informações de Pagamento:</strong> Se você assinar nossos serviços premium, coletaremos informações de pagamento através de nosso processador de pagamentos terceirizado (por exemplo, Stripe, PayPal). Não armazenamos diretamente os detalhes completos do seu cartão de crédito.
                  </li>
                  <li>
                    <strong>Dados de Uso:</strong> Informações sobre como você usa nosso Serviço, como seu endereço IP, tipo de navegador, páginas visitadas, horários de acesso e outras estatísticas.
                  </li>
                  <li>
                    <strong>Cookies e Tecnologias de Rastreamento:</strong> Usamos cookies para melhorar sua experiência. Veja a seção "Cookies" abaixo para mais detalhes.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">3. Como Usamos Suas Informações</h2>
                <p>Usamos as informações que coletamos para:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Fornecer, operar e manter nosso Serviço.</li>
                  <li>Processar suas transações e gerenciar sua assinatura.</li>
                  <li>Melhorar, personalizar e expandir nosso Serviço.</li>
                  <li>Entender e analisar como você usa nosso Serviço.</li>
                  <li>Desenvolver novos produtos, serviços, recursos e funcionalidades.</li>
                  <li>Comunicarmo-nos com você, diretamente ou através de um de nossos parceiros, incluindo para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao Serviço, e para fins de marketing e promocionais (com seu consentimento, quando exigido por lei).</li>
                  <li>Enviar e-mails.</li>
                  <li>Encontrar e prevenir fraudes.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">4. Como Compartilhamos Suas Informações</h2>
                <p>
                  Não vendemos suas informações pessoais. Podemos compartilhar suas informações nas seguintes circunstâncias:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    <strong>Com Provedores de Serviços:</strong> Podemos compartilhar informações com fornecedores terceirizados que nos ajudam a operar nosso Serviço (por exemplo, processadores de pagamento, provedores de hospedagem, serviços de análise).
                  </li>
                  <li>
                    <strong>Para Cumprimento Legal:</strong> Podemos divulgar suas informações se exigido por lei ou em resposta a solicitações válidas de autoridades públicas.
                  </li>
                  <li>
                    <strong>Para Proteger Nossos Direitos:</strong> Podemos divulgar informações quando acreditarmos que é necessário para investigar, prevenir ou tomar medidas em relação a atividades ilegais, suspeita de fraude, situações envolvendo ameaças potenciais à segurança física de qualquer pessoa, violações de nossos Termos de Serviço, ou conforme exigido por lei.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">5. Segurança de Dados</h2>
                <p>
                  Empregamos medidas de segurança razoáveis para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">6. Retenção de Dados</h2>
                <p>
                  Reteremos suas informações pessoais apenas pelo tempo necessário para os fins estabelecidos nesta Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
                </p>
              </section>

               <section>
                <h2 className="text-xl font-semibold text-primary">7. Seus Direitos de Proteção de Dados</h2>
                <p>
                  Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais, como o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Se você deseja exercer esses direitos, entre em contato conosco.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">8. Cookies e Tecnologias de Rastreamento</h2>
                <p>
                  Usamos cookies e tecnologias de rastreamento semelhantes para rastrear a atividade em nosso Serviço e manter certas informações. Cookies são arquivos com uma pequena quantidade de dados que podem incluir um identificador exclusivo anônimo. Você pode instruir seu navegador a recusar todos os cookies ou a indicar quando um cookie está sendo enviado. No entanto, se você não aceitar cookies, talvez não consiga usar algumas partes do nosso Serviço.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">9. Privacidade de Menores</h2>
                <p>
                  Nosso Serviço não se destina a menores de 18 anos. Não coletamos intencionalmente informações de identificação pessoal de menores de 18 anos. Se você é pai ou responsável e sabe que seu filho nos forneceu informações pessoais, entre em contato conosco.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">10. Alterações a esta Política de Privacidade</h2>
                <p>
                  Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página. Aconselhamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary">11. Contato</h2>
                <p>
                  Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em: davicamargodeoliveira2005@gmail.com.
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
