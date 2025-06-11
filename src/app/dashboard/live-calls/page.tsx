"use client";
import { CallCard } from "@/app/dashboard/components/CallCard";
import type { MemeCoinCall } from "@/lib/types";

const mockLiveCalls: MemeCoinCall[] = [
  {
    id: "1",
    coinName: "DogeBonk",
    coinSymbol: "DOBO",
    logoUrl: "https://placehold.co/40x40.png?text=DB",
    entryTime: new Date().toISOString(),
    reason: "Strong volume increase and positive social media sentiment. Potential short squeeze.",
    entryPrice: 0.0000000123,
    targets: [{ price: 0.0000000150, percentage: "+22%" }, { price: 0.0000000180, percentage: "+46%" }],
    stopLoss: 0.0000000090,
    technicalAnalysisSummary: "DOBO shows a bullish divergence on the 4H RSI, with volume picking up significantly. MACD is about to cross bullishly. Key resistance at 0.0000000100 has been broken and retested as support.",
    marketSentimentSummary: "High engagement on Twitter and Reddit, with several influencers mentioning DOBO. Fear & Greed Index for meme coins is neutral, suggesting room for growth.",
  },
  {
    id: "2",
    coinName: "ShibaFloki",
    coinSymbol: "SHIBFLO",
    logoUrl: "https://placehold.co/40x40.png?text=SF",
    entryTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    reason: "Upcoming CEX listing announcement expected within 24 hours. Chart shows consolidation.",
    entryPrice: 0.00000056,
    targets: [{ price: 0.00000070, percentage: "+25%" }, { price: 0.00000090, percentage: "+60%" }],
    stopLoss: 0.00000048,
    technicalAnalysisSummary: "SHIBFLO is consolidating within a symmetrical triangle pattern, typically a continuation pattern. A breakout above the upper trendline could lead to a significant rally. Volume is currently low, indicating accumulation.",
    marketSentimentSummary: "Rumors of a major CEX listing are circulating. Community is highly active and optimistic. Wallet tracker shows an increase in whale holdings.",
  },
];

export default function LiveCallsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Active Trade Calls</h1>
      {mockLiveCalls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {mockLiveCalls.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope text-primary mb-4"><path d="m12 21-1.2-3.6a1 1 0 0 1 1-1.2L18 15l3-3-6-1.8a1 1 0 0 1-1.2-1L9 3 6 6l1.8 6a1 1 0 0 1-1 1.2L3 15"/><circle cx="12" cy="12" r="2"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">No Active Calls</h2>
          <p className="text-muted-foreground text-center">Our analysts are scanning the markets. New calls will appear here shortly!</p>
        </div>
      )}
    </div>
  );
}
