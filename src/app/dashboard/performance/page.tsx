"use client";
import { PerformanceChart } from "@/app/dashboard/components/PerformanceChart";
import type { UserPerformance } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, ListChecks, TrendingUpIcon, TrendingDownIcon, BarChartHorizontalBig, Activity } from "lucide-react";

const mockUserPerformance: UserPerformance = {
  accuracy: 78.3, // More precise
  averageProfit: 165.72, 
  totalTrades: 23,
  winningTrades: 18,
  losingTrades: 5,
  accuracyOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 60 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 65 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 70 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 68 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 72 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 75 },
    { date: new Date().toISOString(), value: 78.3 },
  ],
  profitOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 500 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 650 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 450 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 800 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 950 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 1200 },
    { date: new Date().toISOString(), value: 1350 },
  ],
};

export default function PerformancePage() {
  const profitFactor = mockUserPerformance.losingTrades > 0 ? 
    (mockUserPerformance.winningTrades * (mockUserPerformance.averageProfit / (mockUserPerformance.accuracy/100) ) ) / (mockUserPerformance.losingTrades * (mockUserPerformance.averageProfit / (1-mockUserPerformance.accuracy/100)))
    : Infinity;
  
  // Mock data for win/loss streak chart
  const winLossData = [
    { name: 'Jan', wins: 4, losses: 2 },
    { name: 'Feb', wins: 5, losses: 1 },
    { name: 'Mar', wins: 3, losses: 3 },
    { name: 'Apr', wins: 6, losses: 1 },
    { name: 'May', wins: 4, losses: 2 },
  ];


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Performance Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <StatCard title="Overall Accuracy" value={`${mockUserPerformance.accuracy.toFixed(1)}%`} icon={<Percent className="h-8 w-8 text-primary" />} description="Percentage of winning trades." />
        <StatCard title="Average Profit/Trade" value={`$${mockUserPerformance.averageProfit.toFixed(2)}`} icon={<DollarSign className="h-8 w-8 text-primary" />} description="Average P/L per closed trade." />
        <StatCard title="Total Trades" value={mockUserPerformance.totalTrades.toString()} icon={<ListChecks className="h-8 w-8 text-primary" />} description="Total number of trades taken." />
        <StatCard title="Winning Trades" value={mockUserPerformance.winningTrades.toString()} icon={<TrendingUpIcon className="h-8 w-8 text-green-500" />} description="Number of profitable trades." />
        <StatCard title="Losing Trades" value={mockUserPerformance.losingTrades.toString()} icon={<TrendingDownIcon className="h-8 w-8 text-red-500" />} description="Number of trades with a loss." />
        <StatCard title="Profit Factor" value={isFinite(profitFactor) ? profitFactor.toFixed(2) : "N/A"} icon={<BarChartHorizontalBig className="h-8 w-8 text-primary" />} description="Gross profit / Gross loss." />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <PerformanceChart 
          data={mockUserPerformance.accuracyOverTime} 
          title="Accuracy Over Time" 
          description="Track your trade accuracy trend over recent periods."
          dataKey="accuracy"
          color="hsl(var(--accent))"
        />
        <PerformanceChart 
          data={mockUserPerformance.profitOverTime} 
          title="Cumulative Profit" 
          description="Visualize your profit accumulation over time."
          dataKey="profit"
          chartType="bar"
          color="hsl(var(--primary))"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Monthly Win/Loss Ratio</CardTitle>
          <CardDescription>Comparison of winning vs. losing trades per month.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
           <PerformanceChart 
              data={winLossData.map(d => ({ date: d.name, value: d.wins - d.losses }))} // Simple representation for single line
              title="" 
              description=""
              dataKey="winLossDiff"
              chartType="line"
              color="hsl(var(--chart-3))"
            />
            {/* More complex chart would require custom Recharts setup for multiple bars/lines */}
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
