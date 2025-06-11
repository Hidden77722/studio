
"use client";
import { HistoricalCallCard } from "@/app/dashboard/components/HistoricalCallCard";
import type { HistoricalCall } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { ListFilter, Search } from "lucide-react";

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
    exitPrice: 0.00000180,
    targets: [{ price: 0.00000140 }, { price: 0.00000160 }],
    stopLoss: 0.00000100,
    result: "Win",
    profitOrLossAmount: 500,
    profitOrLossPercentage: "+50.00%",
  },
  {
    id: "h2",
    coinName: "TurboToad",
    coinSymbol: "TURBO",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    reason: "Anúncio de parceria antecipado, stop atingido por volatilidade.",
    entryPrice: 0.000050,
    exitPrice: 0.000049,
    targets: [{ price: 0.000060 }, { price: 0.000075 }],
    stopLoss: 0.000048,
    result: "Loss",
    profitOrLossAmount: -10,
    profitOrLossPercentage: "-2.00%",
  },
   {
    id: "h3",
    coinName: "MogCoin",
    coinSymbol: "MOG",
    logoUrl: "https://placehold.co/40x40.png?text=MG",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 20 * 1).toISOString(),
    reason: "Tendência de meme viral e apoio massivo de influenciadores.",
    entryPrice: 0.00000040,
    exitPrice: 0.00000070,
    targets: [{ price: 0.00000055 }, { price: 0.00000070 }],
    stopLoss: 0.00000035,
    result: "Win",
    profitOrLossAmount: 750,
    profitOrLossPercentage: "+75.00%",
  },
  {
    id: "h4",
    coinName: "Bonk Inu",
    coinSymbol: "BONK",
    logoUrl: "https://placehold.co/40x40.png?text=BK",
    entryTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    exitTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    reason: "Hype do ecossistema Solana e narrativa de recuperação.",
    entryPrice: 0.000020,
    exitPrice: 0.000030,
    targets: [{ price: 0.000025 }, { price: 0.000030 }],
    stopLoss: 0.000018,
    result: "Win",
    profitOrLossAmount: 500,
    profitOrLossPercentage: "+50.00%",
  },
];

export default function TradeHistoryPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterResult, setFilterResult] = React.useState("all"); // 'all', 'Win', 'Loss', 'Pending'

  const filteredCalls = mockHistoricalCalls.filter(call => {
    const matchesSearch = call.coinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          call.coinSymbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterResult === "all" || call.result === filterResult;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Histórico de Trades</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-card rounded-lg shadow">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Buscar por nome ou símbolo da moeda..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterResult} onValueChange={setFilterResult}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <ListFilter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filtrar por resultado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Resultados</SelectItem>
            <SelectItem value="Win">Ganhos</SelectItem>
            <SelectItem value="Loss">Perdas</SelectItem>
            <SelectItem value="Pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCalls.length > 0 ? (
        <div className="space-y-4">
          {filteredCalls.map((call) => (
            <HistoricalCallCard key={call.id} call={call} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-x text-primary mb-4"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2v4"/><path d="M9 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="m14.5 12.5-5-5"/><path d="m9.5 12.5 5-5"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Nenhum Trade Encontrado</h2>
          <p className="text-muted-foreground text-center">Sua busca ou filtro não retornou resultados. Tente ajustar seus critérios ou verifique mais tarde.</p>
        </div>
      )}
    </div>
  );
}
