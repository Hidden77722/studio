
"use client";
import { CallCard } from "@/app/dashboard/components/CallCard";
import type { MemeCoinCall } from "@/lib/types";
import React, { useState, useEffect } from 'react';

// Dados iniciais movidos para fora do componente para não serem recriados
const initialMockLiveCalls: MemeCoinCall[] = [
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
    entryTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    reason: "Anúncio de listagem em CEX de grande porte esperado nas próximas 24 horas. Gráfico mostra consolidação pré-alta.",
    entryPrice: 0.00000056,
    targets: [{ price: 0.000000075, percentage: "+34%" }, { price: 0.000000095, percentage: "+70%" }],
    stopLoss: 0.00000048,
    technicalAnalysisSummary: "SHIBFLO está consolidando dentro de um padrão de triângulo simétrico, tipicamente um padrão de continuação. Um rompimento acima da linha de tendência superior pode levar a uma alta significativa. O volume está atualmente baixo, indicando acumulação.",
    marketSentimentSummary: "Rumores de listagem em uma grande CEX estão circulando. A comunidade está muito ativa e otimista. O rastreador de carteiras mostra um aumento nas participações de baleias.",
  },
];

export default function LiveCallsPage() {
  const [liveCalls, setLiveCalls] = useState<MemeCoinCall[]>(initialMockLiveCalls);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLiveCalls(prevCalls => {
        if (prevCalls.length === 0) return prevCalls;

        // Clona o array para evitar mutação direta do estado
        const updatedCalls = [...prevCalls];
        
        // Atualiza o primeiro alerta para demonstração
        const callToUpdate = { ...updatedCalls[0] };
        const now = new Date();
        callToUpdate.entryTime = now.toISOString();
        // Adiciona um timestamp à razão para tornar a atualização mais visível
        const originalReason = initialMockLiveCalls.find(c => c.id === callToUpdate.id)?.reason || callToUpdate.reason;
        callToUpdate.reason = `Atualizado ${now.toLocaleTimeString('pt-BR')}: ${originalReason.substring(0, 80)}${originalReason.length > 80 ? '...' : ''}`;
        
        updatedCalls[0] = callToUpdate;
        
        // Para dar um efeito de "novos" alertas, podemos ciclar os alertas
        // ou embaralhar a ordem, mas vamos manter simples por enquanto.
        // Exemplo: rotacionar o array de alertas
        // const firstCall = updatedCalls.shift();
        // if (firstCall) updatedCalls.push(firstCall);

        return updatedCalls;
      });
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado
  }, []); // O array de dependências vazio garante que o efeito execute apenas uma vez (montagem/desmontagem)

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
