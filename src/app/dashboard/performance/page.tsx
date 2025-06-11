
"use client";
import { PerformanceChart } from "@/app/dashboard/components/PerformanceChart";
import type { UserPerformance } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, ListChecks, TrendingUpIcon, TrendingDownIcon, BarChartHorizontalBig, Activity } from "lucide-react";

const mockUserPerformance: UserPerformance = {
  accuracy: 90.0, 
  averageProfit: 450.00, 
  totalTrades: 25,
  winningTrades: 22,
  losingTrades: 3,
  accuracyOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 70 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 75 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 80 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 82 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 85 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 88 },
    { date: new Date().toISOString(), value: 90 },
  ],
  profitOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 600 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 1000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 1300 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 1800 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 2300 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 2900 },
    { date: new Date().toISOString(), value: 3500 },
  ],
};

export default function PerformancePage() {
  // Simplified profit factor calculation based on updated mockUserPerformance
  const totalGrossProfit = mockUserPerformance.winningTrades * mockUserPerformance.averageProfit; // Approximate
  // Estimate average loss: (TotalProfit - (Accuracy * TotalTrades * AvgProfit)) / LosingTrades
  // This is a rough estimation for mock data. A more precise model would track individual profits/losses.
  const estimatedTotalLoss = mockUserPerformance.losingTrades > 0 ? (totalGrossProfit / (mockUserPerformance.accuracy / 100) - totalGrossProfit) / (1 - (mockUserPerformance.accuracy / 100)) : 0;
  const absoluteEstimatedTotalLoss = Math.abs(estimatedTotalLoss); // Ensure positive for division
  
  const profitFactor = absoluteEstimatedTotalLoss > 0 && mockUserPerformance.losingTrades > 0
    ? totalGrossProfit / absoluteEstimatedTotalLoss
    : Infinity; // Avoid division by zero if no losses or no losing trades

  // Mock data for win/loss streak chart - Adjusted for more wins
  const winLossData = [
    { name: 'Jan', wins: 7, losses: 1 },
    { name: 'Fev', wins: 8, losses: 0 },
    { name: 'Mar', wins: 6, losses: 1 },
    { name: 'Abr', wins: 9, losses: 1 },
    { name: 'Mai', wins: 7, losses: 0 },
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
              dataKey="winLossDiff" 
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
