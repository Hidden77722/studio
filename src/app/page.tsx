
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/shared/AppLogo";
import Image from "next/image"; // MANTENDO O IMAGE PARA O PLACEHOLDER ABAIXO, COMO ESTAVA ANTES

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

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
          <div className="mb-10">
            <AppLogo />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-6">
            Bem-vindo ao <span className="text-primary">MemeTrade Pro</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 mx-auto">
            Sua plataforma para alertas de trade de meme coins.
          </p>
          <p className="text-md text-muted-foreground max-w-xl mb-10 mx-auto">
            Comece editando <code className="p-1 font-mono text-sm bg-muted rounded-md">src/app/page.tsx</code>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/dashboard">
                Ir para o Painel
              </Link>
            </Button>
          </div>
          <div className="mt-12">
             <Image
              src="https://placehold.co/600x300.png"
              alt="Placeholder Image"
              width={600}
              height={300}
              className="rounded-lg shadow-xl"
              data-ai-hint="blockchain crypto"
            />
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border text-center bg-card/30">
        <nav className="mb-4 text-sm text-muted-foreground space-x-4">
          <Link href="/legal/terms-of-service" className="hover:text-primary hover:underline">Termos de Serviço</Link>
          <span>|</span>
          <Link href="/legal/privacy-policy" className="hover:text-primary hover:underline">Política de Privacidade</Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MemeTrade Pro. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
