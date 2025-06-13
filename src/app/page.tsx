
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/shared/AppLogo";
import { ArrowRight, Zap, BrainCircuit, Target, BarChart2, TrendingUp, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 p-4 sm:p-6 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <AppLogo />
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <Link href="/auth/login">Acessar Painel</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-6 leading-tight">
              Domine o Mercado de <span className="text-primary">Memecoins</span> com IA
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 mx-auto">
              Receba alertas de trade em tempo real, análises de sentimento e gere calls com o poder da inteligência artificial. Maximize seus lucros, minimize os riscos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">
                  Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/billing">
                  Ver Planos
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-card/30 border-t border-b border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-headline font-semibold">Por que MemeTrade Pro?</h2>
              <p className="text-md text-muted-foreground mt-2 max-w-xl mx-auto">
                Ferramentas inteligentes para decisões de trade mais inteligentes no volátil mundo das memecoins.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="Alertas de Trade em Tempo Real"
                description="Receba notificações instantâneas sobre oportunidades de memecoins promissoras, baseadas em IA."
              />
              <FeatureCard
                icon={<BrainCircuit className="h-8 w-8 text-primary" />}
                title="Análise de Sentimento IA"
                description="Entenda o hype e o sentimento do mercado para qualquer memecoin com nossa análise alimentada por IA."
              />
              <FeatureCard
                icon={<Target className="h-8 w-8 text-primary" />}
                title="Gerador de Calls IA (DEX & On-Chain)"
                description="Crie suas próprias calls de trade simuladas, identificando padrões e atividades suspeitas com IA."
              />
              <FeatureCard
                icon={<BarChart2 className="h-8 w-8 text-primary" />}
                title="Pares em Alta (DexScreener)"
                description="Descubra moedas com alto volume, liquidez e hype recente, direto da DexScreener (dados simulados)."
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8 text-primary" />}
                title="Desempenho Detalhado"
                description="Acompanhe seu histórico de trades e métricas de desempenho para otimizar suas estratégias."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-primary" />}
                title="Interface Intuitiva"
                description="Navegue facilmente por todos os recursos em uma plataforma moderna e responsiva."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-headline font-semibold">Simples e Poderoso</h2>
              <p className="text-md text-muted-foreground mt-2 max-w-xl mx-auto">
                Transforme a maneira como você negocia memecoins em poucos passos.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <StepCard
                step="1"
                title="Conecte-se"
                description="Crie sua conta e acesse o painel com todos os recursos."
              />
              <StepCard
                step="2"
                title="Analise & Receba Alertas"
                description="Utilize nossas IAs para analisar o mercado ou receba alertas prontos."
              />
              <StepCard
                step="3"
                title="Opere com Confiança"
                description="Tome decisões informadas com base em dados e insights precisos."
              />
            </div>
          </div>
        </section>
        
        {/* Final Call to Action */}
        <section className="py-16 sm:py-24 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-6">
              Pronto para Elevar seu Trading de Memecoins?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 mx-auto">
              Junte-se ao MemeTrade Pro hoje e comece a tomar decisões mais inteligentes e lucrativas.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/register">
                Criar Conta Gratuita
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center bg-card/30">
        <div className="container mx-auto px-4">
          <nav className="mb-4 text-sm text-muted-foreground space-x-4">
            <Link href="/legal/terms-of-service" className="hover:text-primary hover:underline">Termos de Serviço</Link>
            <span>|</span>
            <Link href="/legal/privacy-policy" className="hover:text-primary hover:underline">Política de Privacidade</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MemeTrade Pro. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Lembre-se: Trading de criptomoedas é arriscado. Invista apenas o que você pode perder. MemeTrade Pro não é aconselhamento financeiro.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-primary/10 transition-shadow">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-headline font-semibold mb-2 text-center">{title}</h3>
      <p className="text-muted-foreground text-sm text-center">{description}</p>
    </div>
  );
}

interface StepCardProps {
  step: string;
  title: string;
  description: string;
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold">
          {step}
        </div>
      </div>
      <h3 className="text-xl font-headline font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
