
"use client";
import { CallCard } from "@/app/dashboard/components/CallCard";
import { useLiveCalls } from "@/hooks/useLiveCalls";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import type { MemeCoinCall } from "@/lib/types"; // Importado para uso explícito
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const NUMBER_OF_VISIBLE_CARDS_PRO = 3; 
const DAILY_LIMIT_FREE_USER = 2;

interface DailyLimitInfo {
  date: string;
  count: number;
}

export default function LiveCallsPage() {
  const { liveCalls, isLoadingInitial } = useLiveCalls();
  const { isProUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [viewableCalls, setViewableCalls] = useState<MemeCoinCall[]>([]);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false);
  const [notifiedCallIds, setNotifiedCallIds] = useState<Set<string>>(new Set());
  const [upgradeToastShownForCurrentBatch, setUpgradeToastShownForCurrentBatch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
        setLocalStorageLoaded(true); // For SSR or non-browser environments
        return;
    }
    if (isLoadingInitial && !localStorageLoaded) { // Apenas setar true se não estiver no browser
      // Evita setar localStorageLoaded para true prematuramente se estiver carregando dados iniciais no cliente
    } else {
      setLocalStorageLoaded(true);
    }

    if (isLoadingInitial || !localStorageLoaded) return;


    // --- Lógica de Notificação e Visualização ---
    const todayStr = new Date().toISOString().split('T')[0];
    let dailyInfo: DailyLimitInfo = { date: todayStr, count: 0 };
    
    try {
      const storedInfo = localStorage.getItem('memetrade_free_user_daily_counter');
      if (storedInfo) {
        const parsedInfo: DailyLimitInfo = JSON.parse(storedInfo);
        if (parsedInfo.date === todayStr) {
          dailyInfo = parsedInfo;
        } else {
          // Data mudou, reseta o contador para o novo dia
          localStorage.setItem('memetrade_free_user_daily_counter', JSON.stringify({ date: todayStr, count: 0 }));
          dailyInfo = { date: todayStr, count: 0 }; // usa o resetado
        }
      } else {
        // Nenhuma informação armazenada, inicializa para hoje
        localStorage.setItem('memetrade_free_user_daily_counter', JSON.stringify(dailyInfo));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      // Considerar um fallback ou estado de erro se o localStorage não estiver acessível
    }

    let currentDailyCount = dailyInfo.count;
    let localUpgradeToastShownThisCycle = upgradeToastShownForCurrentBatch; // Usa o estado para persistir entre renders do effect

    // Resetar upgradeToastShownForCurrentBatch se houver novas calls não notificadas
    const hasNewUnnotifiedCalls = liveCalls.some(call => !notifiedCallIds.has(call.id));
    if (hasNewUnnotifiedCalls && upgradeToastShownForCurrentBatch) {
        setUpgradeToastShownForCurrentBatch(false); // Permite que o toast de upgrade apareça para uma nova "leva"
        localUpgradeToastShownThisCycle = false; // Reseta a variável local também
    }
    
    const newNotifiedIdsThisCycle = new Set<string>();

    liveCalls.forEach(call => {
      if (!notifiedCallIds.has(call.id)) { // Processa apenas calls não notificadas ainda neste ciclo de vida do componente
        newNotifiedIdsThisCycle.add(call.id); // Marca para adicionar ao estado depois do loop
        if (isProUser) {
          toast({
            title: "🚀 Nova Call de Trade!",
            description: `${call.coinName} (${call.coinSymbol}) - Entrada: $${call.entryPrice.toPrecision(4)}`,
          });
        } else { // Usuário Free
          if (currentDailyCount < DAILY_LIMIT_FREE_USER) {
            toast({
              title: "🔥 Nova Call Gratuita!",
              description: `${call.coinName} (${call.coinSymbol}) - ${currentDailyCount + 1}/${DAILY_LIMIT_FREE_USER} de hoje.`,
            });
            currentDailyCount++; // Incrementa o contador local para esta call
            try {
              // Atualiza o localStorage IMEDIATAMENTE para refletir a call "consumida"
              localStorage.setItem('memetrade_free_user_daily_counter', JSON.stringify({ date: todayStr, count: currentDailyCount }));
              dailyInfo.count = currentDailyCount; // Atualiza a variável dailyInfo também
            } catch (error) {
              console.error("Error updating localStorage for daily limit (notification):", error);
            }
          } else { // Limite diário gratuito atingido
            if (!localUpgradeToastShownThisCycle) {
              toast({
                title: "💡 Novas Calls Disponíveis!",
                description: "Você atingiu seu limite de calls gratuitas. Faça upgrade para Pro para acesso ilimitado!",
                action: (
                  <ToastAction altText="Upgrade" onClick={() => router.push('/dashboard/billing')}>
                    Upgrade
                  </ToastAction>
                ),
              });
              setUpgradeToastShownForCurrentBatch(true); // Marcar que o toast de upgrade foi mostrado nesta "leva"
              localUpgradeToastShownThisCycle = true;
            }
          }
        }
      }
    });

    if (newNotifiedIdsThisCycle.size > 0) {
        setNotifiedCallIds(prev => new Set([...prev, ...newNotifiedIdsThisCycle]));
    }

    // --- Lógica de Visualização de Cards (usa dailyInfo.count atualizado) ---
    if (isProUser) {
      setViewableCalls(liveCalls.slice(0, NUMBER_OF_VISIBLE_CARDS_PRO));
      setDailyLimitReached(false);
    } else {
      if (dailyInfo.count >= DAILY_LIMIT_FREE_USER) {
        setDailyLimitReached(true);
        setViewableCalls([]);
      } else {
        setDailyLimitReached(false);
        const remainingSlots = DAILY_LIMIT_FREE_USER - dailyInfo.count;
        const callsToShow = liveCalls.slice(0, remainingSlots);
        setViewableCalls(callsToShow);
      }
    }

  }, [isProUser, liveCalls, isLoadingInitial, toast, router, notifiedCallIds, localStorageLoaded, upgradeToastShownForCurrentBatch]);


  if (!localStorageLoaded || (isLoadingInitial && liveCalls.length === 0 && viewableCalls.length === 0)) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-headline font-semibold">Alertas de Trade Ativos</h1>
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-circle animate-spin text-primary mb-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Carregando Alertas...</h2>
          <p className="text-muted-foreground text-center">Buscando os dados mais recentes do mercado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold">Alertas de Trade Ativos</h1>
      
      {!isProUser && dailyLimitReached && (
        <Card className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Limite Diário Atingido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você visualizou seus {DAILY_LIMIT_FREE_USER} alertas gratuitos de hoje.</p>
            <p className="mt-2">Faça upgrade para o MemeTrade Pro para ter acesso ilimitado a todos os alertas, análises de IA e muito mais!</p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/dashboard/billing">
                <ShieldAlert className="mr-2 h-4 w-4" /> Fazer Upgrade para Pro
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {viewableCalls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {viewableCalls.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      ) : !dailyLimitReached && !isLoadingInitial && ( 
         <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope text-primary mb-4"><path d="m12 21-1.2-3.6a1 1 0 0 1 1-1.2L18 15l3-3-6-1.8a1 1 0 0 1-1.2-1L9 3 6 6l1.8 6a1 1 0 0 1-1 1.2L3 15"/><circle cx="12" cy="12" r="2"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Nenhum Alerta Ativo no Momento</h2>
          <p className="text-muted-foreground text-center">
            {isProUser 
              ? "Nossos analistas estão monitorando os mercados. Novos alertas aparecerão aqui em breve!"
              : "Verifique novamente mais tarde para novos alertas gratuitos ou considere o upgrade."
            }
          </p>
        </div>
      )}

      {!isProUser && !dailyLimitReached && liveCalls.length > DAILY_LIMIT_FREE_USER && viewableCalls.length < liveCalls.length && (
         <Card className="md:col-span-1 lg:col-span-2 xl:col-span-3 bg-primary/10 border-primary/30 text-primary">
            <CardHeader>
              <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5" /> Desbloqueie Mais Alertas!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Você está vendo {viewableCalls.length} de {liveCalls.length > 0 ? liveCalls.length : "vários"} alertas disponíveis.</p>
              <p className="mt-2">Com o MemeTrade Pro, você tem acesso a <strong>todos os alertas</strong>, análises detalhadas de IA, histórico completo e muito mais. Não perca a próxima grande oportunidade!</p>
              <Button asChild className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard/billing">Fazer Upgrade Agora</Link>
              </Button>
            </CardContent>
          </Card>
      )}
       {!isProUser && !dailyLimitReached && viewableCalls.length > 0 && viewableCalls.length < DAILY_LIMIT_FREE_USER && (
         <Card className="md:col-span-1 lg:col-span-2 xl:col-span-3 bg-muted/50 border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Você ainda pode ver mais {DAILY_LIMIT_FREE_USER - viewableCalls.length} alerta(s) gratuito(s) hoje.
                Para acesso ilimitado e todos os recursos, <Link href="/dashboard/billing" className="text-primary underline">considere o MemeTrade Pro</Link>.
              </p>
            </CardContent>
          </Card>
       )}


    </div>
  );
}
