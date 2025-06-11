
"use client"; 

import React, { useState, useEffect } from 'react'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallCard } from "./components/CallCard";
import { HistoricalCallCard } from "./components/HistoricalCallCard";
import { PerformanceChart } from "./components/PerformanceChart";
import type { MemeCoinCall, HistoricalCall, UserPerformance } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, ListChecks, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

const initialMockLiveCalls: MemeCoinCall[] = [
  {
    id: "dash-1",
    coinName: "RocketDoge",
    coinSymbol: "RDOGE",
    logoUrl: "https://placehold.co/40x40.png?text=RD",
    entryTime: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // Entrou 3 minutos atrás
    reason: "Pump massivo coordenado no Twitter e Reddit, indicadores técnicos confirmando rompimento de resistência chave. Observado grande volume na Axiom Trade.",
    entryPrice: 0.0000000250,
    targets: [{ price: 0.0000000500, percentage: "+100%" }, { price: 0.0000000750, percentage: "+200%" }],
    stopLoss: 0.0000000180,
    technicalAnalysisSummary: "RDOGE acaba de romper uma cunha descendente com volume 5x acima da média. RSI no gráfico de 1H está em 70, indicando forte pressão compradora. Volume crescente na Axiom Trade.",
    marketSentimentSummary: "Campanha #RocketDogeArmy viralizando no Twitter. Posts em subreddits como r/MemeCoinMoonshots e r/CryptoMars estão explodindo com menções a RDOGE. Aumento de negociações na Axiom Trade.",
  },
  {
    id: "dash-2",
    coinName: "Pepa Inu",
    coinSymbol: "PEPA",
    logoUrl: "https://placehold.co/40x40.png?text=PP",
    entryTime: new Date(Date.now() - 1000 * 60 * 7).toISOString(), // Entrou 7 minutos atrás
    reason: "Anúncio de parceria com grande influenciador do TikTok e listagem iminente na corretora 'MemeXchange'. Gráfico mostra acumulação. Potencial listagem na Axiom Trade sendo discutida.",
    entryPrice: 0.00000110,
    targets: [{ price: 0.00000200, percentage: "+81%" }, { price: 0.00000300, percentage: "+172%" }],
    stopLoss: 0.00000090,
    technicalAnalysisSummary: "PEPA formou um padrão 'copo e alça' (cup and handle) no gráfico de 4H, um forte sinal de continuação de alta. Volume de acumulação tem aumentado. Suporte forte na MM50.",
    marketSentimentSummary: "O influenciador 'CryptoKingGuru' (10M seguidores no TikTok) acaba de postar um vídeo sobre PEPA. Rumores fortes de listagem na MemeXchange. Comunidade de olho na Axiom Trade.",
  },
];

const mockHistoricalCalls: HistoricalCall[] = [ 
  {
    id: "h1",
    coinName: "ShibaMoon",
    coinSymbol: "SHIBM",
    logoUrl: "https://placehold.co/40x40.png?text=SM",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 18 * 1).toISOString(), // Saiu 18h depois
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
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4.8).toISOString(), // Stopado rapidamente
    reason: "Tentativa de pegar um fundo após grande correção, mas o mercado continuou caindo. Baixo volume na Axiom Trade.",
    entryPrice: 0.000070,
    exitPrice: 0.000068, 
    targets: [{ price: 0.000080 }, { price: 0.000095 }],
    stopLoss: 0.000068, // Atingiu o stop
    result: "Loss",
    profitOrLossAmount: -30, 
    profitOrLossPercentage: "-2.86%", 
  },
   {
    id: "h3",
    coinName: "DogeYield",
    coinSymbol: "DOGEY",
    logoUrl: "https://placehold.co/40x40.png?text=DY",
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
  accuracy: 97.0, // Aumentando a precisão
  averageProfit: 1750.00, // Aumentando o lucro médio
  totalTrades: 35, 
  winningTrades: 34, // Mais trades vencedores
  losingTrades: 1, // Menos trades perdedores
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
    { date: new Date().toISOString(), value: 59500 }, // Lucro total aumentado
  ],
};

export default function DashboardPage() {
  const [liveCalls, setLiveCalls] = useState<MemeCoinCall[]>(initialMockLiveCalls);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLiveCalls(prevCalls => {
        if (prevCalls.length === 0) return prevCalls;
        
        const updatedCalls = [...prevCalls];
        const callIndexToUpdate = Math.floor(Math.random() * updatedCalls.length);
        const callToUpdate = {...updatedCalls[callIndexToUpdate]}; 
        
        const now = new Date();
        callToUpdate.entryTime = now.toISOString();
        
        const originalCallData = initialMockLiveCalls.find(c => c.id === callToUpdate.id) || callToUpdate;
        
        const reasonVariations = [
          "Forte volume de compra na Axiom Trade agora!", 
          "Rumores de queima de token se intensificam no Reddit!", 
          "Indicador MACD acaba de cruzar para alta no gráfico de 15min!"
        ];
        const randomVariation = reasonVariations[Math.floor(Math.random() * reasonVariations.length)];
        const baseReason = originalCallData.reason.split('.')[0];
        callToUpdate.reason = `ALERTA DASH (${now.toLocaleTimeString('pt-BR')}): ${randomVariation} ${baseReason}.`;
        
        updatedCalls[callIndexToUpdate] = callToUpdate;
        return updatedCalls;
      });
    }, 7000); 

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {liveCalls.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {liveCalls.map((call) => (
                <CallCard key={call.id} call={call} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum alerta ativo no momento. Fique ligado!</p>
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
