
"use client";

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallCard } from "./components/CallCard";
import { HistoricalCallCard } from "./components/HistoricalCallCard";
// import { PerformanceChart } from "./components/PerformanceChart"; // Original import
import type { HistoricalCall, UserPerformance, MemeCoinCall } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, ListChecks, TrendingUpIcon, TrendingDownIcon, Loader2 } from "lucide-react";
import { useLiveCalls } from '@/hooks/useLiveCalls';
import { useAuth } from '@/context/AuthContext'; 
import dynamic from 'next/dynamic';

const PerformanceChartLoadingSkeleton = () => (
  <Card className="shadow-lg h-[auto] min-h-[346px]"> {/* Adjusted for auto height based on content */}
    <CardHeader>
      <div className="h-6 bg-muted/30 rounded w-3/4 animate-pulse mb-1"></div> {/* Skeleton for title */}
      <div className="h-4 bg-muted/30 rounded w-1/2 animate-pulse"></div> {/* Skeleton for description */}
    </CardHeader>
    <CardContent className="flex items-center justify-center h-[250px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading Chart...</p>
    </CardContent>
  </Card>
);

const PerformanceChart = dynamic(() => import('./components/PerformanceChart').then(mod => mod.PerformanceChart), {
  ssr: false,
  loading: () => <PerformanceChartLoadingSkeleton />
});


const mockHistoricalCalls: HistoricalCall[] = [
  {
    id: "h1",
    coinName: "ShibaMoon",
    coinSymbol: "SHIBM",
    logoUrl: "https://placehold.co/40x40.png",
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
    logoUrl: "https://placehold.co/40x40.png",
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
    logoUrl: "https://placehold.co/40x40.png",
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
  accuracy: 96.5,
  averageProfit: 1850.00,
  totalTrades: 50,
  winningTrades: 48,
  losingTrades: 2,
  accuracyOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 92 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 93 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 94 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 95 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 95.5 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 96 },
    { date: new Date().toISOString(), value: 96.5 },
  ],
  profitOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 8000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 15000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 25000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 38000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 55000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 75000 },
    { date: new Date().toISOString(), value: 88800 },
  ],
};

const NUMBER_OF_VISIBLE_CARDS_DASHBOARD = 2;
const DAILY_LIMIT_FREE_USER_DASHBOARD = 2; // Consistent with live-calls page

interface DailyFixedCallsInfo {
  date: string;
  calls: MemeCoinCall[];
}

// Helper function
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export default function DashboardPage() {
  const { liveCalls, isLoadingInitial } = useLiveCalls();
  const { isProUser } = useAuth();

  const [fixedDailyCallsForDashboard, setFixedDailyCallsForDashboard] = useState<MemeCoinCall[]>([]);
  const [localStorageCallsLoaded, setLocalStorageCallsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!localStorageCallsLoaded) {
      setLocalStorageCallsLoaded(true);
      // Allow the effect to continue to the next checks in the same run
    }

    if (isProUser || isLoadingInitial || !localStorageCallsLoaded) {
      return; // Pro users see live data, or still loading, or localStorage not yet checked for this page
    }

    // Free user logic for fixed daily calls
    const todayStr = getTodayString();
    let storedDailyInfo: DailyFixedCallsInfo | null = null;
    try {
      const item = localStorage.getItem('memetrade_free_user_fixed_calls');
      if (item) {
        storedDailyInfo = JSON.parse(item) as DailyFixedCallsInfo;
      }
    } catch (error) {
      console.error("[DashboardPage] Error parsing fixed calls from localStorage:", error);
      localStorage.removeItem('memetrade_free_user_fixed_calls'); // Clear corrupted item
    }

    if (storedDailyInfo && storedDailyInfo.date === todayStr) {
      setFixedDailyCallsForDashboard(storedDailyInfo.calls);
    } else if (liveCalls.length > 0) {
      // New day or no stored calls for today, fix new ones from system if available
      const callsToFix = liveCalls.slice(0, DAILY_LIMIT_FREE_USER_DASHBOARD);
      const newDailyInfo: DailyFixedCallsInfo = { date: todayStr, calls: callsToFix };
      try {
        // This write operation ensures consistency if live-calls page hasn't run yet today for this user
        localStorage.setItem('memetrade_free_user_fixed_calls', JSON.stringify(newDailyInfo));
      } catch (error) {
        console.error("[DashboardPage] Error saving fixed calls to localStorage:", error);
      }
      setFixedDailyCallsForDashboard(callsToFix);
    } else if (!storedDailyInfo) {
        // No stored info and no live calls yet to fix, set to empty
        setFixedDailyCallsForDashboard([]);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProUser, isLoadingInitial, liveCalls, localStorageCallsLoaded]);


  const callsForDashboardTab = isProUser ? liveCalls : fixedDailyCallsForDashboard;
  const showLoadingForDashboardTab = isLoadingInitial && callsForDashboardTab.length === 0 && !(!isProUser && localStorageCallsLoaded && fixedDailyCallsForDashboard.length > 0);


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
          {showLoadingForDashboardTab ? (
             <div className="flex flex-col items-center justify-center h-48 bg-card rounded-lg p-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-circle animate-spin text-primary mb-3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <p className="text-muted-foreground">Carregando alertas...</p>
             </div>
          ) : callsForDashboardTab.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {callsForDashboardTab.slice(0, NUMBER_OF_VISIBLE_CARDS_DASHBOARD).map((call) => (
                <CallCard key={call.id} call={call} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-card rounded-lg p-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope text-primary mb-3"><path d="m12 21-1.2-3.6a1 1 0 0 1 1-1.2L18 15l3-3-6-1.8a1 1 0 0 1-1.2-1L9 3 6 6l1.8 6a1 1 0 0 1-1 1.2L3 15"/><circle cx="12" cy="12" r="2"/></svg>
                <p className="text-muted-foreground text-center">
                  {isProUser ? "Nenhum alerta ativo no momento. Fique ligado!" : "Suas calls gratuitas de hoje ainda não foram geradas pelo sistema ou não há calls disponíveis."}
                </p>
                {!isLoadingInitial && !isProUser && callsForDashboardTab.length === 0 &&
                  <p className="text-xs text-muted-foreground mt-2 text-center">(As 2 calls gratuitas são fixadas no início do dia quando disponíveis no sistema.)</p>
                }
                {!isLoadingInitial && isProUser && callsForDashboardTab.length === 0 &&
                  <p className="text-xs text-muted-foreground mt-2 text-center">(Se este problema persistir, pode haver uma dificuldade em buscar dados da API. Verifique sua conexão ou o status da API.)</p>
                }
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
              dataKey="value" 
              color="hsl(var(--accent))"
            />
            <PerformanceChart
              data={mockUserPerformance.profitOverTime}
              title="Lucro Acumulado ao Longo do Tempo"
              description="Sua tendência de acumulação de lucro."
              dataKey="value" 
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
