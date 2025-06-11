
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallCard } from "./components/CallCard";
import { HistoricalCallCard } from "./components/HistoricalCallCard";
import { PerformanceChart } from "./components/PerformanceChart";
import type { MemeCoinCall, HistoricalCall, UserPerformance } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, ListChecks, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

// Mock Data Ajustado para Lucro Alto e Perdas Mínimas
const mockLiveCalls: MemeCoinCall[] = [
  {
    id: "1",
    coinName: "DogeBonk",
    coinSymbol: "DOBO",
    logoUrl: "https://placehold.co/40x40.png?text=DB",
    entryTime: new Date().toISOString(),
    reason: "Forte aumento de volume e sentimento positivo nas redes sociais. Potencial short squeeze com alvo ambicioso.",
    entryPrice: 0.0000000123,
    targets: [{ price: 0.0000000160, percentage: "+30%" }, { price: 0.0000000200, percentage: "+62%" }],
    stopLoss: 0.0000000090,
    technicalAnalysisSummary: "DOBO mostra uma divergência de alta no RSI de 4H, com volume aumentando significativamente. MACD está prestes a cruzar para alta. A resistência chave em 0.0000000100 foi quebrada e retestada como suporte.",
    marketSentimentSummary: "Alto engajamento no Twitter e Reddit, com vários influenciadores mencionando DOBO. O Índice de Medo e Ganância para meme coins está neutro, sugerindo espaço para crescimento.",
  },
  {
    id: "2",
    coinName: "ShibaFloki",
    coinSymbol: "SHIBFLO",
    logoUrl: "https://placehold.co/40x40.png?text=SF",
    entryTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    reason: "Anúncio de listagem em CEX de grande porte esperado nas próximas 24 horas. Gráfico mostra consolidação pré-alta.",
    entryPrice: 0.00000056,
    targets: [{ price: 0.000000075, percentage: "+34%" }, { price: 0.000000095, percentage: "+70%" }],
    stopLoss: 0.00000048,
    technicalAnalysisSummary: "SHIBFLO está consolidando dentro de um padrão de triângulo simétrico, tipicamente um padrão de continuação. Um rompimento acima da linha de tendência superior pode levar a uma alta significativa. O volume está atualmente baixo, indicando acumulação.",
    marketSentimentSummary: "Rumores de listagem em uma grande CEX estão circulando. A comunidade está muito ativa e otimista. O rastreador de carteiras mostra um aumento nas participações de baleias.",
  },
];

const mockHistoricalCalls: HistoricalCall[] = [
  {
    id: "h1",
    coinName: "PepeCoin",
    coinSymbol: "PEPE",
    logoUrl: "https://placehold.co/40x40.png?text=PP",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    reason: "Rompimento de canal descendente com forte volume.",
    entryPrice: 0.00000120,
    exitPrice: 0.00000180, // Ajustado para maior lucro
    targets: [{ price: 0.00000140 }, { price: 0.00000160 }],
    stopLoss: 0.00000100,
    result: "Win",
    profitOrLossAmount: 500, // Aumentado
    profitOrLossPercentage: "+50.00%", // Ajustado
  },
  {
    id: "h2",
    coinName: "TurboToad",
    coinSymbol: "TURBO",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    reason: "Anúncio de parceria antecipado, stop atingido por volatilidade.",
    entryPrice: 0.000050,
    exitPrice: 0.000049, // Ajustado para perda mínima
    targets: [{ price: 0.000060 }, { price: 0.000075 }],
    stopLoss: 0.000048,
    result: "Loss",
    profitOrLossAmount: -10, // Perda mínima
    profitOrLossPercentage: "-2.00%", // Ajustado
  },
   {
    id: "h3",
    coinName: "MogCoin",
    coinSymbol: "MOG",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 20 * 1).toISOString(),
    reason: "Tendência de meme viral e apoio massivo de influenciadores.",
    entryPrice: 0.00000040,
    exitPrice: 0.00000070, // Ajustado
    targets: [{ price: 0.00000055 }, { price: 0.00000070 }],
    stopLoss: 0.00000035,
    result: "Win",
    profitOrLossAmount: 750, // Aumentado
    profitOrLossPercentage: "+75.00%", // Ajustado
  },
];

const mockUserPerformance: UserPerformance = {
  accuracy: 90.0, // Aumentado
  averageProfit: 450.00, // Aumentado
  totalTrades: 25, // Ajustado
  winningTrades: 22, // Aumentado
  losingTrades: 3, // Diminuído
  accuracyOverTime: [
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 70 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 75 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 80 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 82 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 85 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 88 },
    { date: new Date().toISOString(), value: 90 },
  ],
  profitOverTime: [ // Valores cumulativos maiores
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), value: 600 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), value: 1000 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), value: 1300 }, 
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), value: 1800 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), value: 2300 },
    { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), value: 2900 },
    { date: new Date().toISOString(), value: 3500 },
  ],
};

export default function DashboardPage() {
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
          {mockLiveCalls.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {mockLiveCalls.map((call) => (
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
