import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, BarChart3, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="p-4 sm:p-6 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <AppLogo />
          <Button asChild variant="outline">
            <Link href="/dashboard">Painel</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 sm:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-6">
          Desbloqueie <span className="text-primary">Negociações Lucrativas</span> de Meme Coins
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10">
          O MemeTrade Pro oferece alertas de negociação de meme coins em tempo real e com alta precisão, capacitando você a navegar no volátil mercado de criptomoedas com confiança.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/auth/login">
            Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        <div className="mt-16 sm:mt-24 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-lg shadow-lg flex flex-col items-center">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-headline font-semibold mb-2">Alertas em Tempo Real</h3>
            <p className="text-muted-foreground text-sm">Notificações instantâneas para entradas promissoras em meme coins.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg flex flex-col items-center">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-headline font-semibold mb-2">Precisão Comprovada</h3>
            <p className="text-muted-foreground text-sm">Acompanhe nosso desempenho histórico e negocie com insights baseados em dados.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg flex flex-col items-center">
            <ShieldCheck className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-headline font-semibold mb-2">Seguro e Exclusivo</h3>
            <p className="text-muted-foreground text-sm">Plataforma confiável com acesso por assinatura para traders dedicados.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-border text-center">
        <AppLogo />
        <p className="text-sm text-muted-foreground mt-2">
          © {new Date().getFullYear()} MemeTrade Pro. Todos os direitos reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Aviso Legal: A negociação de criptomoedas envolve risco significativo de perda.
        </p>
      </footer>
    </div>
  );
}
