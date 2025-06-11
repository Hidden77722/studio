
"use client";
import { CallCard } from "@/app/dashboard/components/CallCard";
import type { MemeCoinCall } from "@/lib/types";
import React, { useState, useEffect } from 'react';

const allMockLiveCalls: MemeCoinCall[] = [
  {
    id: "rdoge-1",
    coinName: "RocketDoge",
    coinSymbol: "RDOGE",
    logoUrl: "https://placehold.co/40x40.png?text=RD",
    logoAiHint: "rocket doge",
    entryTime: new Date().toISOString(),
    reason: "Pump massivo coordenado no Twitter e Reddit, indicadores técnicos confirmando rompimento de resistência chave. Alto volume na Axiom Trade.",
    entryPrice: 0.0000000250,
    targets: [{ price: 0.0000000500, percentage: "+100%" }, { price: 0.0000000750, percentage: "+200%" }],
    stopLoss: 0.0000000180,
    technicalAnalysisSummary: "RDOGE acaba de romper uma cunha descendente com volume 5x acima da média. RSI no gráfico de 1H está em 70, indicando forte pressão compradora. Próxima resistência significativa apenas em 0.0000000500, oferecendo grande potencial de alta.",
    marketSentimentSummary: "Campanha #RocketDogeArmy viralizando no Twitter. Posts em subreddits como r/MemeCoinMoonshots e r/CryptoMars estão explodindo com menções a RDOGE. Sentimento de FOMO generalizado detectado. Grande volume de negociação observado na Axiom Trade, sugerindo interesse institucional.",
  },
  {
    id: "pepa-1",
    coinName: "Pepa Inu",
    coinSymbol: "PEPA",
    logoUrl: "https://placehold.co/40x40.png?text=PI",
    logoAiHint: "pepa frog",
    entryTime: new Date().toISOString(),
    reason: "Anúncio de parceria com grande influenciador do TikTok e listagem iminente na corretora 'MemeXchange'. Gráfico mostra acumulação. Comentários positivos sobre listagem na Axiom Trade.",
    entryPrice: 0.00000110,
    targets: [{ price: 0.00000200, percentage: "+81%" }, { price: 0.00000300, percentage: "+172%" }],
    stopLoss: 0.00000090,
    technicalAnalysisSummary: "PEPA formou um padrão 'copo e alça' (cup and handle) no gráfico de 4H, um forte sinal de continuação de alta. Volume de acumulação tem aumentado discretamente. Suporte forte na média móvel de 50 períodos.",
    marketSentimentSummary: "O influenciador 'CryptoKingGuru' (10M seguidores no TikTok) acaba de postar um vídeo sobre PEPA. Rumores fortes de listagem na MemeXchange nas próximas 48h. Comunidade no Discord e Telegram muito engajada e esperando o 'pump da listagem'. Especulações positivas sobre futura listagem na Axiom Trade também impulsionam o sentimento.",
  },
  {
    id: "shibx-1",
    coinName: "ShibaXtreme",
    coinSymbol: "SHIBX",
    logoUrl: "https://placehold.co/40x40.png?text=SX",
    logoAiHint: "shiba xtreme",
    entryTime: new Date().toISOString(),
    reason: "Nova narrativa 'Shiba Killer 2.0' ganhando tração no Reddit. Análise de contrato indica baixo risco de rug pull. Volume na Axiom Trade começando a subir.",
    entryPrice: 0.0000000050,
    targets: [{ price: 0.0000000100, percentage: "+100%" }, { price: 0.0000000150, percentage: "+200%" }],
    stopLoss: 0.0000000035,
    technicalAnalysisSummary: "SHIBX está formando um fundo arredondado no gráfico de 15min, com divergência bullish no MACD. Rompimento da neckline pode levar a uma rápida valorização. Volume na Axiom Trade em ascensão.",
    marketSentimentSummary: "Thread viral em r/SatoshiStreetBets sobre o potencial de SHIBX. Diversos tweets de contas de 'crypto gems' mencionando SHIBX. Sentimento extremamente positivo.",
  },
  {
    id: "catmoon-1",
    coinName: "CatMoon",
    coinSymbol: "CMOON",
    logoUrl: "https://placehold.co/40x40.png?text=CM",
    logoAiHint: "cat moon",
    entryTime: new Date().toISOString(),
    reason: "Meme de gato popular sendo associado à moeda. Grande comunidade artística no Twitter criando NFTs e impulsionando o hype. Axiom Trade adicionou par de negociação.",
    entryPrice: 0.000072,
    targets: [{ price: 0.000150, percentage: "+108%" }, { price: 0.000220, percentage: "+205%" }],
    stopLoss: 0.000060,
    technicalAnalysisSummary: "CMOON está consolidando acima da EMA de 20 dias no gráfico diário. Um rompimento da atual faixa de consolidação com volume confirmaria a continuação da tendência de alta. Grande liquidez na Axiom Trade.",
    marketSentimentSummary: "Artistas e colecionadores de NFT estão promovendo CMOON no Twitter com a hashtag #CatMoonToMars. Sorteios e competições no Discord para aumentar o engajamento.",
  },
  {
    id: "flokiz-1",
    coinName: "FlokiZilla",
    coinSymbol: "FLOKIZ",
    logoUrl: "https://placehold.co/40x40.png?text=FZ",
    logoAiHint: "floki zilla",
    entryTime: new Date().toISOString(),
    reason: "Combinação de dois memes populares (Floki e Godzilla). Ameaças de 'queima de tokens' pela equipe no Twitter. Rumores de listagem na Axiom Trade.",
    entryPrice: 0.00000012,
    targets: [{ price: 0.00000024, percentage: "+100%" }, { price: 0.00000036, percentage: "+200%" }],
    stopLoss: 0.00000009,
    technicalAnalysisSummary: "FLOKIZ está testando uma linha de tendência de baixa de curto prazo. Rompimento com volume seria um forte sinal de compra. RSI no gráfico de 1H está saindo da zona de sobrevenda.",
    marketSentimentSummary: "Comunidade #FlokiZillaArmy muito ativa, promovendo a moeda em todos os canais. AMAs (Ask Me Anything) com a equipe de desenvolvimento gerando confiança. Especulação forte sobre listagem na Axiom Trade.",
  }
];

const NUMBER_OF_VISIBLE_CARDS = 3; // Quantidade de cards a serem exibidos

export default function LiveCallsPage() {
  const [liveCalls, setLiveCalls] = useState<MemeCoinCall[]>(() =>
    allMockLiveCalls.slice(0, NUMBER_OF_VISIBLE_CARDS).map(call => ({
      ...call,
      id: `${call.id}-${Date.now()}`, // Unique ID for key prop
      entryTime: new Date().toISOString(),
    }))
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLiveCalls(prevCalls => {
        const newCalls = [...prevCalls];

        // Decide se substitui um card ou apenas atualiza um existente
        if (Math.random() < 0.3 && allMockLiveCalls.length > NUMBER_OF_VISIBLE_CARDS) { // 30% de chance de substituir um card
          const callIndexToReplace = Math.floor(Math.random() * newCalls.length);

          // Encontra um novo card que não esteja atualmente na lista
          let newCallData;
          let attempts = 0;
          do {
            newCallData = allMockLiveCalls[Math.floor(Math.random() * allMockLiveCalls.length)];
            attempts++;
          } while (newCalls.some(c => c.coinSymbol === newCallData.coinSymbol) && attempts < allMockLiveCalls.length * 2);

          if (newCallData) {
            newCalls[callIndexToReplace] = {
              ...newCallData,
              id: `${newCallData.id}-${Date.now()}`, // Unique ID for key prop
              entryTime: new Date().toISOString(),
              reason: `[NOVO!] ${newCallData.reason.substring(0,70)}... (${new Date().toLocaleTimeString('pt-BR')})`
            };
          }
        } else { // Atualiza um card existente
          const callIndexToUpdate = Math.floor(Math.random() * newCalls.length);
          const callToUpdate = { ...newCalls[callIndexToUpdate] };

          const now = new Date();
          callToUpdate.entryTime = now.toISOString();

          const reasonVariations = [
            "Movimentação de baleias detectada na Axiom Trade!",
            "Novo tweet de influenciador mencionando esta moeda!",
            "Volume na Axiom Trade disparou nos últimos 5 minutos!",
            "Listagem na Axiom Trade confirmada para amanhã!"
          ];
          const randomVariation = reasonVariations[Math.floor(Math.random() * reasonVariations.length)];
          const baseReason = allMockLiveCalls.find(c => c.coinSymbol === callToUpdate.coinSymbol)?.reason.split('.')[0] || callToUpdate.reason.split('.')[0];
          callToUpdate.reason = `${randomVariation} ${baseReason}. (Atualizado: ${now.toLocaleTimeString('pt-BR')})`;

          newCalls[callIndexToUpdate] = callToUpdate;
        }
        return newCalls;
      });
    }, 5000); // Atualiza a cada 5 segundos

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
