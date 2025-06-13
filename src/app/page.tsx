
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, BarChart3, Zap, Rocket, LayoutDashboard, Brain, Search, CheckCircle, Star, ThumbsUp, Users, Cpu, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300 ease-in-out h-full">
    <CardHeader className="items-center">
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Icon className="h-10 w-10 text-primary" />
      </div>
      <CardTitle className="text-xl font-headline">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{description}</p>
    </CardContent>
  </Card>
);

const HowItWorksStep = ({ icon: Icon, title, description, stepNumber }: { icon: React.ElementType, title: string, description: string, stepNumber: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative mb-4">
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
        {stepNumber}
      </div>
    </div>
    <h4 className="text-lg font-semibold mb-1">{title}</h4>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const TestimonialCard = ({ avatarUrl, name, role, text, stars = 5, dataAiHint }: { avatarUrl: string, name: string, role: string, text: string, stars?: number, dataAiHint: string }) => (
  <Card className="bg-card/80 backdrop-blur-sm shadow-xl flex flex-col items-center p-6 h-full">
    <Image src={avatarUrl} alt={name} width={80} height={80} className="rounded-full mb-4 border-2 border-primary" data-ai-hint={dataAiHint} />
    <h4 className="text-lg font-headline font-semibold">{name}</h4>
    <p className="text-xs text-primary mb-1">{role}</p>
    <div className="flex mb-3">
      {Array(stars).fill(0).map((_, i) => (
        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <p className="text-muted-foreground text-sm text-center italic">"{text}"</p>
  </Card>
);


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 p-4 sm:p-6 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <AppLogo />
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <Link href="/auth/login">Acessar Painel</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 sm:py-24 flex flex-col md:flex-row items-center text-center md:text-left">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-6">
              Desbloqueie Trades <span className="text-primary">Lucrativos</span> de Meme Coins com <span className="text-primary">IA</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 mx-auto md:mx-0">
              Alertas em tempo real, análises precisas e ferramentas poderosas para você dominar o volátil mercado de meme coins com confiança.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/register">
                  Crie sua Conta Grátis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-input hover:border-primary hover:text-primary">
                <Link href="#features">
                  Saber Mais
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="https://placehold.co/600x400.png"
              alt="MemeTrade Pro Platform Showcase"
              width={600}
              height={400}
              priority
              className="rounded-lg shadow-2xl"
              data-ai-hint="trading chart finance"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-4">Por que MemeTrade Pro?</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Nossas ferramentas são projetadas para dar a você a vantagem que precisa no dinâmico universo das meme coins.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={Zap}
                title="Alertas IA em Tempo Real"
                description="Receba notificações instantâneas sobre oportunidades de trade promissoras detectadas por nossa IA avançada."
              />
              <FeatureCard
                icon={Cpu}
                title="Gerador de Calls com IA"
                description="Gere calls de trade on-chain e baseadas em DexScreener usando o poder de múltiplas IAs analíticas."
              />
              <FeatureCard
                icon={BarChart3}
                title="Análise de Sentimento"
                description="Entenda o hype e o sentimento do mercado para tomar decisões mais informadas antes de cada trade."
              />
              <FeatureCard
                icon={LayoutDashboard}
                title="Interface Intuitiva"
                description="Navegue facilmente por dados complexos com nosso painel amigável, projetado para traders de todos os níveis."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-4">Comece em Minutos</h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
              Negociar meme coins nunca foi tão simples e direto.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <HowItWorksStep icon={Users} title="Crie sua Conta" description="Registro rápido e fácil. Comece com nosso plano gratuito." stepNumber="1" />
              <HowItWorksStep icon={Target} title="Configure Seus Alertas" description="Personalize notificações para as moedas e estratégias que lhe interessam." stepNumber="2" />
              <HowItWorksStep icon={Rocket} title="Opere com Confiança" description="Use nossos insights de IA para tomar decisões mais inteligentes e maximizar seus lucros." stepNumber="3" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 sm:py-24 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-4">O que Nossos Usuários Dizem</h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
              Traders como você estão alcançando novos patamares com MemeTrade Pro.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                avatarUrl="https://placehold.co/80x80.png"
                dataAiHint="man face"
                name="Carlos S."
                role="Trader Entusiasta"
                text="O MemeTrade Pro é incrível! Os alertas de IA são muito precisos e a interface é super fácil de usar. Meus lucros aumentaram!"
              />
              <TestimonialCard
                avatarUrl="https://placehold.co/80x80.png"
                dataAiHint="woman face"
                name="Juliana M."
                role="Investidora de Cripto"
                text="Finalmente uma ferramenta que realmente entende o mercado de meme coins. O gerador de calls é fantástico."
              />
              <TestimonialCard
                avatarUrl="https://placehold.co/80x80.png"
                dataAiHint="person avatar"
                name="Alex P."
                role="Novo no Mundo das Memes"
                text="Comecei há pouco tempo e o MemeTrade Pro me deu a confiança que eu precisava para operar. Recomendo!"
              />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-6">Pronto para Elevar Seus Trades de Meme Coins?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Junte-se à comunidade MemeTrade Pro hoje mesmo e transforme sua estratégia de investimento com o poder da inteligência artificial.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6">
              <Link href="/auth/register">
                Comece a Lucrar Agora <Rocket className="ml-3 h-5 w-5" />
              </Link>
            </Button>
             <p className="mt-6 text-sm text-muted-foreground">
              Já tem uma conta? <Link href="/auth/login" className="text-primary hover:underline font-semibold">Faça login</Link>.
            </p>
          </div>
        </section>

      </main>

      <footer className="py-8 border-t border-border text-center bg-card/30">
        <div className="mb-4">
         <AppLogo />
        </div>
        <nav className="mb-4 text-sm text-muted-foreground space-x-4">
          <Link href="/legal/terms-of-service" className="hover:text-primary hover:underline">Termos de Serviço</Link>
          <span>|</span>
          <Link href="/legal/privacy-policy" className="hover:text-primary hover:underline">Política de Privacidade</Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MemeTrade Pro. Todos os direitos reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Aviso Legal: A negociação de criptomoedas envolve risco significativo de perda. O MemeTrade Pro fornece informações e não aconselhamento financeiro.
        </p>
      </footer>
    </div>
  );
}
