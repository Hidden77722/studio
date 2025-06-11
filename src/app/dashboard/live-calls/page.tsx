
"use client";
import { CallCard } from "@/app/dashboard/components/CallCard";
import { useLiveCalls } from "@/hooks/useLiveCalls"; // Import the new hook
import React from 'react';

const NUMBER_OF_VISIBLE_CARDS = 3; // This page will display all calls managed by the hook

export default function LiveCallsPage() {
  const { liveCalls, isLoadingInitial } = useLiveCalls(); // Use the hook

  if (isLoadingInitial && liveCalls.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-headline font-semibold">Alertas de Trade Ativos</h1>
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-circle animate-spin text-primary mb-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Carregando Alertas Iniciais...</h2>
          <p className="text-muted-foreground text-center">Buscando os dados mais recentes do mercado. Isso pode levar alguns instantes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Alertas de Trade Ativos</h1>
      {liveCalls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {liveCalls.slice(0, NUMBER_OF_VISIBLE_CARDS).map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope text-primary mb-4"><path d="m12 21-1.2-3.6a1 1 0 0 1 1-1.2L18 15l3-3-6-1.8a1 1 0 0 1-1.2-1L9 3 6 6l1.8 6a1 1 0 0 1-1 1.2L3 15"/><circle cx="12" cy="12" r="2"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Nenhum Alerta Ativo</h2>
          <p className="text-muted-foreground text-center">Nossos analistas estão monitorando os mercados. Novos alertas aparecerão aqui em breve!</p>
          <p className="text-xs text-muted-foreground mt-2">(Se este problema persistir, pode haver uma dificuldade em buscar dados de preços. Verifique sua conexão com a internet ou o status da API CoinGecko.)</p>
        </div>
      )}
    </div>
  );
}

    