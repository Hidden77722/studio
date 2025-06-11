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
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 sm:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-6">
          Unlock <span className="text-primary">Profitable</span> Meme Coin Trades
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10">
          MemeTrade Pro delivers high-accuracy, real-time trade calls for meme coins, empowering you to navigate the volatile crypto market with confidence.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/auth/login">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        <div className="mt-16 sm:mt-24 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-lg shadow-lg flex flex-col items-center">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-headline font-semibold mb-2">Real-Time Calls</h3>
            <p className="text-muted-foreground text-sm">Instant notifications for promising meme coin entries.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg flex flex-col items-center">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-headline font-semibold mb-2">Proven Accuracy</h3>
            <p className="text-muted-foreground text-sm">Track our historical performance and trade with data-backed insights.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg flex flex-col items-center">
            <ShieldCheck className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-headline font-semibold mb-2">Secure & Exclusive</h3>
            <p className="text-muted-foreground text-sm">Reliable platform with subscription-based access for dedicated traders.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-border text-center">
        <AppLogo />
        <p className="text-sm text-muted-foreground mt-2">
          © {new Date().getFullYear()} MemeTrade Pro. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Disclaimer: Trading cryptocurrency involves significant risk of loss.
        </p>
      </footer>
    </div>
  );
}
