
"use client";
// import { PerformanceChart } from "@/app/dashboard/components/PerformanceChart"; // Original import
import type { UserPerformance } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, ListChecks, TrendingUpIcon, TrendingDownIcon, BarChartHorizontalBig, Activity, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';
import React from 'react';

const ChartLoadingSkeleton = () => (
  <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md p-4"> {/* Adjusted height based on CardContent */}
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="ml-2 text-muted-foreground">Loading Chart...</p>
  </div>
);

const PerformanceChart = dynamic(() => import("@/app/dashboard/components/PerformanceChart").then(mod => mod.PerformanceChart), {
  ssr: false,
  loading: () => <ChartLoadingSkeleton />
});


const mockUserPerformance: UserPerformance = {
  accuracy: 95.0, 
  averageProfit: 1250.00, 
  totalTrades: 40,
  winningTrades: 38,
  losingTrades: 2,
  accuracyOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 88 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 90 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 91 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 93 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 94 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 94.5 },
    { date: new Date().toISOString(), value: 95 },
  ],
  profitOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 5000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 9500 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 15000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 22000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 31000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 40500 },
    { date: new Date().toISOString(), value: 47500 }, // Total profit = winningTrades * averageProfit - losingTrades * (algo)
  ],
};

export default function PerformancePage() {
  const totalGrossProfit = mockUserPerformance.winningTrades * mockUserPerformance.averageProfit;
  // Simplified estimation for total loss for profit factor calculation
  const estimatedAverageLoss = mockUserPerformance.averageProfit / 2; // Assume avg loss is half of avg profit for mock
  const absoluteEstimatedTotalLoss = mockUserPerformance.losingTrades * estimatedAverageLoss;
  
  const profitFactor = absoluteEstimatedTotalLoss > 0
    ? totalGrossProfit / absoluteEstimatedTotalLoss
    : Infinity;

  const winLossData = [
    { name: 'Jan', wins: 10, losses: 1 }, // Adjusted to reflect more wins
    { name: 'Fev', wins: 12, losses: 0 },
    { name: 'Mar', wins: 8, losses: 1 },
    { name: 'Abr', wins: 7, losses: 0 },
    { name: 'Mai', wins: 11, losses: 0 }, // Example: 38 wins / 2 losses over 5 months
  ];


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Painel de Desempenho</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <StatCard title="Precisão Geral" value={`${mockUserPerformance.accuracy.toFixed(1)}%`} icon={<Percent className="h-8 w-8 text-primary" />} description="Porcentagem de trades vencedores." />
        <StatCard title="Lucro Médio/Trade" value={`$${mockUserPerformance.averageProfit.toFixed(2)}`} icon={<DollarSign className="h-8 w-8 text-primary" />} description="G/P médio por trade fechado." />
        <StatCard title="Total de Trades" value={mockUserPerformance.totalTrades.toString()} icon={<ListChecks className="h-8 w-8 text-primary" />} description="Número total de trades realizados." />
        <StatCard title="Trades Vencedores" value={mockUserPerformance.winningTrades.toString()} icon={<TrendingUpIcon className="h-8 w-8 text-green-500" />} description="Número de trades lucrativos." />
        <StatCard title="Trades Perdedores" value={mockUserPerformance.losingTrades.toString()} icon={<TrendingDownIcon className="h-8 w-8 text-red-500" />} description="Número de trades com perda." />
        <StatCard title="Fator de Lucro" value={isFinite(profitFactor) ? profitFactor.toFixed(2) : "N/D"} icon={<BarChartHorizontalBig className="h-8 w-8 text-primary" />} description="Lucro bruto / Perda bruta (estimado)." />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <PerformanceChart 
          data={mockUserPerformance.accuracyOverTime} 
          title="Precisão ao Longo do Tempo" 
          description="Acompanhe sua tendência de precisão nos trades em períodos recentes."
          dataKey="accuracy"
          color="hsl(var(--accent))"
        />
        <PerformanceChart 
          data={mockUserPerformance.profitOverTime} 
          title="Lucro Acumulado" 
          description="Visualize sua acumulação de lucro ao longo do tempo."
          dataKey="profit"
          chartType="bar"
          color="hsl(var(--primary))"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Taxa Mensal de Ganhos/Perdas</CardTitle>
          <CardDescription>Comparação de trades vencedores vs. perdedores por mês.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
           <PerformanceChart 
              data={winLossData.map(d => ({ date: d.name, value: d.wins - d.losses }))} 
              title="" 
              description=""
              dataKey="winLossDiff" // Using a different dataKey to avoid conflict if chartConfig is shared
              chartType="line"
              color="hsl(var(--chart-3))"
            />
        </CardContent>
      </Card>

    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
