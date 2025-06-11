
"use client";

import React from 'react'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallCard } from "./components/CallCard";
import { HistoricalCallCard } from "./components/HistoricalCallCard";
import { PerformanceChart } from "./components/PerformanceChart";
import type { HistoricalCall, UserPerformance } from "@/lib/types"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, ListChecks, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { useLiveCalls } from '@/hooks/useLiveCalls'; 

const mockHistoricalCalls: HistoricalCall[] = [
  {
    id: "h1",
    coinName: "ShibaMoon",
    coinSymbol: "SHIBM",
    logoUrl: "https://placehold.co/40x40.png?text=SM",
    logoAiHint: "shiba moon",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 18 * 1).toISOString(),
    reason: "Rompimento de ATH (All-Time High) com forte apoio da comunidade no Reddit e listagem na Axiom Trade.",
    entryPrice: 0.00000080,
    exitPrice: 0.00000240,
    targets: [{ price: 0.00000120 }, { price: 0.00000180 }, { price: 0.00000220}],
    stopLoss: 0.00000065,
    result: "Win",
    profitOrLossAmount: 2500,
    profitOrLossPercentage: "+212.50%",
  },
  {
    id: "h2",
    coinName: "FlokiRocket",
    coinSymbol: "FLOKIR",
    logoUrl: "https://placehold.co/40x40.png?text=FR",
    logoAiHint: "floki rocket",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4.8).toISOString(), 
    reason: "Tentativa de pegar um fundo após grande correção, mas o mercado continuou caindo. Baixo volume na Axiom Trade.",
    entryPrice: 0.000070,
    exitPrice: 0.000068,
    targets: [{ price: 0.000080 }, { price: 0.000095 }],
    stopLoss: 0.000068,
    result: "Loss",
    profitOrLossAmount: -30,
    profitOrLossPercentage: "-2.86%",
  },
   {
    id: "h3",
    coinName: "DogeYield",
    coinSymbol: "DOGEY",
    logoUrl: "https://placehold.co/40x40.png?text=DY",
    logoAiHint: "doge yield",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 20 * 1).toISOString(),
    reason: "Lançamento de novo recurso de staking com APY atrativo, gerando buzz no Twitter e aumentando a liquidez na Axiom Trade.",
    entryPrice: 0.0010,
    exitPrice: 0.0028,
    targets: [{ price: 0.0015 }, { price: 0.0020 }, { price: 0.0025}],
    stopLoss: 0.0008,
    result: "Win",
    profitOrLossAmount: 1800,
    profitOrLossPercentage: "+180.00%",
  },
];

const mockUserPerformance: UserPerformance = {
  accuracy: 97.0,
  averageProfit: 1750.00,
  totalTrades: 35,
  winningTrades: 34,
  losingTrades: 1,
  accuracyOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 85 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 88 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 90 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 92 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 94 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 95 },
    { date: new Date().toISOString(), value: 97 },
  ],
  profitOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 7000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 12000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 19000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 28000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 38000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 50000 },
    { date: new Date().toISOString(), value: 59500 },
  ],
};

const NUMBER_OF_VISIBLE_CARDS_DASHBOARD = 2;

export default function DashboardPage() {
  const { liveCalls, isLoadingInitial } = useLiveCalls(); 

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Painel MemeTrade Pro</h1>

      <Tabs defaultValue="live-calls" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex bg-card border border-border">
          <TabsTrigger value="live-calls" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Alertas ao Vivo</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Histórico de Trades</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Desempenho</TabsTrigger>
        </TabsList>

        <TabsContent value="live-calls" className="mt-6">
          <h2 className="text-2xl font-headline mb-4">Alertas de Trade Ativos</h2>
          {isLoadingInitial && liveCalls.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-48 bg-card rounded-lg p-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-circle animate-spin text-primary mb-3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <p className="text-muted-foreground">Carregando alertas...</p>
             </div>
          ) : liveCalls.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {liveCalls.slice(0, NUMBER_OF_VISIBLE_CARDS_DASHBOARD).map((call) => (
                <CallCard key={call.id} call={call} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-card rounded-lg p-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope text-primary mb-3"><path d="m12 21-1.2-3.6a1 1 0 0 1 1-1.2L18 15l3-3-6-1.8a1 1 0 0 1-1.2-1L9 3 6 6l1.8 6a1 1 0 0 1-1 1.2L3 15"/><circle cx="12" cy="12" r="2"/></svg>
                <p className="text-muted-foreground text-center">Nenhum alerta ativo no momento. Fique ligado!</p>
                {!isLoadingInitial && <p className="text-xs text-muted-foreground mt-2 text-center">(Se este problema persistir, pode haver uma dificuldade em buscar dados da API CoinGecko. Verifique sua conexão ou o status da API.)</p>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <h2 className="text-2xl font-headline mb-4">Desempenho Histórico de Trades</h2>
           {mockHistoricalCalls.length > 0 ? (
            <div className="space-y-4">
              {mockHistoricalCalls.map((call) => (
                <HistoricalCallCard key={call.id} call={call} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum histórico de trades disponível ainda.</p>
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <h2 className="text-2xl font-headline mb-4">Suas Estatísticas de Trading</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
            <StatCard title="Precisão" value={`${mockUserPerformance.accuracy.toFixed(1)}%`} icon={<Percent className="h-6 w-6 text-primary" />} />
            <StatCard title="Lucro Médio" value={`$${mockUserPerformance.averageProfit.toFixed(2)}`} icon={<DollarSign className="h-6 w-6 text-primary" />} />
            <StatCard title="Total de Trades" value={mockUserPerformance.totalTrades.toString()} icon={<ListChecks className="h-6 w-6 text-primary" />} />
            <StatCard title="Trades Vencedores" value={mockUserPerformance.winningTrades.toString()} icon={<TrendingUpIcon className="h-6 w-6 text-green-500" />} />
            <StatCard title="Trades Perdedores" value={mockUserPerformance.losingTrades.toString()} icon={<TrendingDownIcon className="h-6 w-6 text-red-500" />} />
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <PerformanceChart
              data={mockUserPerformance.accuracyOverTime}
              title="Precisão ao Longo do Tempo"
              description="Sua tendência de precisão nos trades."
              dataKey="accuracy"
              color="hsl(var(--accent))"
            />
            <PerformanceChart
              data={mockUserPerformance.profitOverTime}
              title="Lucro Acumulado ao Longo do Tempo"
              description="Sua tendência de acumulação de lucro."
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
