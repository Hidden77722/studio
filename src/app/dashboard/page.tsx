import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallCard } from "./components/CallCard";
import { HistoricalCallCard } from "./components/HistoricalCallCard";
import { PerformanceChart } from "./components/PerformanceChart";
import type { MemeCoinCall, HistoricalCall, UserPerformance } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, ListChecks, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

// Mock Data
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

const mockHistoricalCalls: HistoricalCall[] = [
  {
    id: "h1",
    coinName: "PepeCoin",
    coinSymbol: "PEPE",
    logoUrl: "https://placehold.co/40x40.png?text=PP",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    reason: "Breakout from descending channel.",
    entryPrice: 0.00000120,
    exitPrice: 0.00000150,
    targets: [{ price: 0.00000140 }, { price: 0.00000160 }],
    stopLoss: 0.00000100,
    result: "Win",
    profitOrLossAmount: 300, // Example amount
    profitOrLossPercentage: "+25.00%",
  },
  {
    id: "h2",
    coinName: "TurboToad",
    coinSymbol: "TURBO",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    reason: "Anticipated partnership announcement.",
    entryPrice: 0.000050,
    exitPrice: 0.000045,
    targets: [{ price: 0.000060 }, { price: 0.000075 }],
    stopLoss: 0.000048,
    result: "Loss",
    profitOrLossAmount: -50, // Example amount
    profitOrLossPercentage: "-10.00%",
  },
   {
    id: "h3",
    coinName: "MogCoin",
    coinSymbol: "MOG",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 20 * 1).toISOString(),
    reason: "Meme trend and influencer backing.",
    entryPrice: 0.00000040,
    exitPrice: 0.00000062,
    targets: [{ price: 0.00000055 }, { price: 0.00000070 }],
    stopLoss: 0.00000035,
    result: "Win",
    profitOrLossAmount: 550,
    profitOrLossPercentage: "+55.00%",
  },
];

const mockUserPerformance: UserPerformance = {
  accuracy: 75.0,
  averageProfit: 150.25, // currency
  totalTrades: 20,
  winningTrades: 15,
  losingTrades: 5,
  accuracyOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 60 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 65 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 70 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 68 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 72 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 75 },
    { date: new Date().toISOString(), value: 78 },
  ],
  profitOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 500 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 650 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 450 }, // a loss
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 800 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 950 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 1200 },
    { date: new Date().toISOString(), value: 1350 },
  ],
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">MemeTrade Pro Dashboard</h1>
      
      <Tabs defaultValue="live-calls" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex bg-card border border-border">
          <TabsTrigger value="live-calls" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Live Calls</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Trade History</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="live-calls" className="mt-6">
          <h2 className="text-2xl font-headline mb-4">Active Trade Calls</h2>
          {mockLiveCalls.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {mockLiveCalls.map((call) => (
                <CallCard key={call.id} call={call} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No active calls at the moment. Stay tuned!</p>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <h2 className="text-2xl font-headline mb-4">Historical Trade Performance</h2>
           {mockHistoricalCalls.length > 0 ? (
            <div className="space-y-4">
              {mockHistoricalCalls.map((call) => (
                <HistoricalCallCard key={call.id} call={call} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No trade history available yet.</p>
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <h2 className="text-2xl font-headline mb-4">Your Trading Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
            <StatCard title="Accuracy" value={`${mockUserPerformance.accuracy.toFixed(1)}%`} icon={<Percent className="h-6 w-6 text-primary" />} />
            <StatCard title="Avg. Profit" value={`$${mockUserPerformance.averageProfit.toFixed(2)}`} icon={<DollarSign className="h-6 w-6 text-primary" />} />
            <StatCard title="Total Trades" value={mockUserPerformance.totalTrades.toString()} icon={<ListChecks className="h-6 w-6 text-primary" />} />
            <StatCard title="Winning Trades" value={mockUserPerformance.winningTrades.toString()} icon={<TrendingUpIcon className="h-6 w-6 text-green-500" />} />
            <StatCard title="Losing Trades" value={mockUserPerformance.losingTrades.toString()} icon={<TrendingDownIcon className="h-6 w-6 text-red-500" />} />
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <PerformanceChart 
              data={mockUserPerformance.accuracyOverTime} 
              title="Accuracy Over Time" 
              description="Your trade accuracy trend."
              dataKey="accuracy"
              color="hsl(var(--accent))"
            />
            <PerformanceChart 
              data={mockUserPerformance.profitOverTime} 
              title="Cumulative Profit Over Time" 
              description="Your profit accumulation trend."
              dataKey="profit"
              chartType="bar"
              color="hsl(var(--primary))"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
