
"use client";
import { CallCard } from "@/app/dashboard/components/CallCard";
import type { MemeCoinCall } from "@/lib/types";
import React, { useState, useEffect } from 'react';

const initialMockLiveCalls: MemeCoinCall[] = [
  {
    id: "1",
    coinName: "RocketDoge",
    coinSymbol: "RDOGE",
    logoUrl: "https://placehold.co/40x40.png?text=RD",
    entryTime: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // Entrou 2 minutos atrás
    reason: "Pump massivo coordenado no Twitter e Reddit, indicadores técnicos confirmando rompimento de resistência chave. Alto volume na Axiom Trade.",
    entryPrice: 0.0000000250,
    targets: [{ price: 0.0000000500, percentage: "+100%" }, { price: 0.0000000750, percentage: "+200%" }],
    stopLoss: 0.0000000180,
    technicalAnalysisSummary: "RDOGE acaba de romper uma cunha descendente com volume 5x acima da média. RSI no gráfico de 1H está em 70, indicando forte pressão compradora. Próxima resistência significativa apenas em 0.0000000500, oferecendo grande potencial de alta.",
    marketSentimentSummary: "Campanha #RocketDogeArmy viralizando no Twitter. Posts em subreddits como r/MemeCoinMoonshots e r/CryptoMars estão explodindo com menções a RDOGE. Sentimento de FOMO generalizado detectado. Grande volume de negociação observado na Axiom Trade, sugerindo interesse institucional.",
  },
  {
    id: "2",
    coinName: "Pepa Inu",
    coinSymbol: "PEPA",
    logoUrl: "https://placehold.co/40x40.png?text=PP",
    entryTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // Entrou 5 minutos atrás
    reason: "Anúncio de parceria com grande influenciador do TikTok e listagem iminente na corretora 'MemeXchange'. Gráfico mostra acumulação. Comentários positivos sobre listagem na Axiom Trade.",
    entryPrice: 0.00000110,
    targets: [{ price: 0.00000200, percentage: "+81%" }, { price: 0.00000300, percentage: "+172%" }],
    stopLoss: 0.00000090,
    technicalAnalysisSummary: "PEPA formou um padrão 'copo e alça' (cup and handle) no gráfico de 4H, um forte sinal de continuação de alta. Volume de acumulação tem aumentado discretamente. Suporte forte na média móvel de 50 períodos.",
    marketSentimentSummary: "O influenciador 'CryptoKingGuru' (10M seguidores no TikTok) acaba de postar um vídeo sobre PEPA. Rumores fortes de listagem na MemeXchange nas próximas 48h. Comunidade no Discord e Telegram muito engajada e esperando o 'pump da listagem'. Especulações positivas sobre futura listagem na Axiom Trade também impulsionam o sentimento.",
  },
];

export default function LiveCallsPage() {
  const [liveCalls, setLiveCalls] = useState<MemeCoinCall[]>(initialMockLiveCalls);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLiveCalls(prevCalls => {
        if (prevCalls.length === 0) return prevCalls;

        const updatedCalls = [...prevCalls];
        
        // Escolhe um card aleatório para atualizar, para variar qual card é atualizado.
        const callIndexToUpdate = Math.floor(Math.random() * updatedCalls.length);
        const callToUpdate = { ...updatedCalls[callIndexToUpdate] };
        
        const now = new Date();
        callToUpdate.entryTime = now.toISOString();
        
        const originalCallData = initialMockLiveCalls.find(c => c.id === callToUpdate.id) || callToUpdate;
        
        // Pequena variação na razão para mostrar atualização
        const reasonVariations = [
          "Movimentação de baleias detectada na Axiom Trade!", 
          "Novo tweet de Elon Musk mencionando 'Doge' indiretamente!", 
          "Volume na Axiom Trade disparou nos últimos 5 minutos!",
          "Listagem na Axiom Trade confirmada para amanhã!"
        ];
        const randomVariation = reasonVariations[Math.floor(Math.random() * reasonVariations.length)];
        // Usar uma parte da razão original para manter o contexto
        const baseReason = originalCallData.reason.split('.')[0]; // Pega a primeira sentença
        callToUpdate.reason = `${randomVariation} ${baseReason}. (Atualizado: ${now.toLocaleTimeString('pt-BR')})`;
        
        updatedCalls[callIndexToUpdate] = callToUpdate;
        
        return updatedCalls;
      });
    }, 5000); 

    return () => clearInterval(intervalId); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Alertas de Trade Ativos</h1>
      {liveCalls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {liveCalls.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope text-primary mb-4"><path d="m12 21-1.2-3.6a1 1 0 0 1 1-1.2L18 15l3-3-6-1.8a1 1 0 0 1-1.2-1L9 3 6 6l1.8 6a1 1 0 0 1-1 1.2L3 15"/><circle cx="12" cy="12" r="2"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Nenhum Alerta Ativo</h2>
          <p className="text-muted-foreground text-center">Nossos analistas estão monitorando os mercados. Novos alertas aparecerão aqui em breve!</p>
        </div>
      )}
    </div>
  );
}
