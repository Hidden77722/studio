
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import type { MemeCoinCall } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { CallCard } from "@/app/dashboard/components/CallCard";
import { useAuth } from "@/context/AuthContext";
import { useLiveCalls } from "@/hooks/useLiveCalls";

const NUMBER_OF_VISIBLE_CARDS_PRO = 3;
const DAILY_LIMIT_FREE_USER = 2;

interface DailyFixedCallsInfo {
  date: string;
  calls: MemeCoinCall[];
}

export default function LiveCallsPage() {
  const { liveCalls, isLoadingInitial: isLoadingLiveCalls } = useLiveCalls();
  const { user, isProUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [viewableCalls, setViewableCalls] = useState<MemeCoinCall[]>([]);
  const [fixedDailyCallsForFreeUser, setFixedDailyCallsForFreeUser] = useState<MemeCoinCall[]>([]);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false);
  const [notifiedCallIds, setNotifiedCallIds] = useState<Set<string>>(new Set());
  const [upgradeToastShownForCurrentBatch, setUpgradeToastShownForCurrentBatch] = useState(false);

  const getTodayString = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!localStorageLoaded) {
      setLocalStorageLoaded(true);
      // Allow the effect to continue to the next checks in the same run
    }
    
    if (isProUser || isLoadingLiveCalls || !localStorageLoaded) { 
      return;
    }

    const todayStr = getTodayString();
    let storedDailyInfo: DailyFixedCallsInfo | null = null;
    try {
      const item = localStorage.getItem('memetrade_free_user_fixed_calls');
      if (item) {
        storedDailyInfo = JSON.parse(item) as DailyFixedCallsInfo;
      }
    } catch (error) {
      console.error("Error parsing fixed calls from localStorage:", error);
      localStorage.removeItem('memetrade_free_user_fixed_calls');
    }

    if (storedDailyInfo && storedDailyInfo.date === todayStr) {
      setFixedDailyCallsForFreeUser(storedDailyInfo.calls);
      setDailyLimitReached(storedDailyInfo.calls.length >= DAILY_LIMIT_FREE_USER);
    } else if (liveCalls.length > 0) {
      // New day or no stored calls for today, fix new ones
      const callsToFix = liveCalls.slice(0, DAILY_LIMIT_FREE_USER);
      const newDailyInfo: DailyFixedCallsInfo = { date: todayStr, calls: callsToFix };
      try {
        localStorage.setItem('memetrade_free_user_fixed_calls', JSON.stringify(newDailyInfo));
      } catch (error) { 
        console.error("Error saving fixed calls to localStorage:", error);
      }
      setFixedDailyCallsForFreeUser(callsToFix);
      setDailyLimitReached(callsToFix.length >= DAILY_LIMIT_FREE_USER);

      // Notify for newly fixed calls
      callsToFix.forEach((call, index) => {
        setNotifiedCallIds(prevNotified => {
          if (!prevNotified.has(call.id)) {
            // Use a different basis for callNumber if fixedDailyCallsForFreeUser might not be updated yet
            const callNumberForToast = index + 1; 
            setTimeout(() => {
              toast({
                title: "🔥 Nova Call Gratuita Diária!",
                description: `${call.coinName} (${call.coinSymbol}) - Sua ${callNumberForToast}ª call gratuita de hoje (${callsToFix.length}/${DAILY_LIMIT_FREE_USER} disponíveis no sistema para fixar).`,
              });
            }, 0);
            const updatedNotified = new Set(prevNotified);
            updatedNotified.add(call.id);
            return updatedNotified;
          }
          return prevNotified;
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [isProUser, isLoadingLiveCalls, liveCalls, localStorageLoaded, getTodayString, toast, fixedDailyCallsForFreeUser.length]);


  useEffect(() => {
    if (!localStorageLoaded) {
      return;
    }

    if (isProUser) {
      setViewableCalls(liveCalls.slice(0, NUMBER_OF_VISIBLE_CARDS_PRO));
      setDailyLimitReached(false); // Pro users never reach a limit

      liveCalls.forEach(call => {
        setNotifiedCallIds(prev => { 
          if (!prev.has(call.id)) {
            setTimeout(() => {
              toast({
                title: "🚀 Nova Call de Trade!",
                description: `${call.coinName} (${call.coinSymbol}) - Entrada: $${call.entryPrice.toPrecision(4)}`,
              });
            }, 0);
            const newSet = new Set(prev); 
            newSet.add(call.id);
            return newSet;
          }
          return prev;
        });
      });

      if (upgradeToastShownForCurrentBatch) {
        setUpgradeToastShownForCurrentBatch(false);
      }
    } else { // Free user logic
      setViewableCalls(fixedDailyCallsForFreeUser);

      const newSystemCallsUnseenByFreeUser = liveCalls.filter(sysCall =>
        !fixedDailyCallsForFreeUser.some(fixedCall => fixedCall.id === sysCall.id) &&
        !notifiedCallIds.has(`upgrade-toast-for-${sysCall.id}`)
      );

      if (newSystemCallsUnseenByFreeUser.length > 0 && dailyLimitReached && !upgradeToastShownForCurrentBatch) {
        setTimeout(() => {
          toast({
            title: "💡 Novas Calls Disponíveis no Sistema!",
            description: "Você já viu suas calls gratuitas de hoje. Faça upgrade para Pro para acesso ilimitado!",
            action: (
              <ToastAction altText="Upgrade" onClick={() => router.push('/dashboard/billing')}>
                Upgrade
              </ToastAction>
            ),
          });
        }, 0);
        setUpgradeToastShownForCurrentBatch(true);

        newSystemCallsUnseenByFreeUser.forEach(call => {
            setNotifiedCallIds(prev => { 
                const newSet = new Set(prev); 
                newSet.add(`upgrade-toast-for-${call.id}`);
                return newSet;
            });
        });
      } else if (newSystemCallsUnseenByFreeUser.length === 0 && upgradeToastShownForCurrentBatch) {
         setUpgradeToastShownForCurrentBatch(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isProUser,
    liveCalls,
    fixedDailyCallsForFreeUser, // Removed .length, using the object itself
    dailyLimitReached,
    toast, 
    router, 
    localStorageLoaded,
    notifiedCallIds, 
    upgradeToastShownForCurrentBatch,
    // State setters are stable: setViewableCalls, setDailyLimitReached, setNotifiedCallIds, setUpgradeToastShownForCurrentBatch
  ]);


  if (!localStorageLoaded || (isLoadingLiveCalls && fixedDailyCallsForFreeUser.length === 0 && liveCalls.length === 0 && !isProUser)) {
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

      {!isProUser && dailyLimitReached && fixedDailyCallsForFreeUser.length >= DAILY_LIMIT_FREE_USER && (
        <Card className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Suas Calls Gratuitas de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você já visualizou suas {fixedDailyCallsForFreeUser.length} alertas gratuitos de hoje. Estes alertas permanecerão aqui para consulta.</p>
            <p className="mt-2">Novas calls estão chegando ao sistema! Faça upgrade para o MemeTrade Pro para ter acesso ilimitado.</p>
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
      ) : !isProUser && dailyLimitReached && fixedDailyCallsForFreeUser.length === 0 && !isLoadingLiveCalls ? (
         <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coffee text-primary mb-4"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
            <h2 className="text-xl font-headline text-foreground mb-2">Nenhuma Call Fixada Hoje</h2>
            <p className="text-muted-foreground text-center">
                Não havia calls disponíveis no sistema para fixar como suas gratuitas de hoje. Novas calls podem estar disponíveis para usuários Pro.
                <Link href="/dashboard/billing" className="text-primary underline ml-1">Considere o upgrade</Link>.
            </p>
        </div>
      )
      : isLoadingLiveCalls && isProUser && viewableCalls.length === 0 ? ( 
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-circle animate-spin text-primary mb-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Verificando Alertas...</h2>
          <p className="text-muted-foreground text-center">Buscando os dados mais recentes.</p>
        </div>
      )
      : ( 
         <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope text-primary mb-4"><path d="m12 21-1.2-3.6a1 1 0 0 1 1-1.2L18 15l3-3-6-1.8a1 1 0 0 1-1.2-1L9 3 6 6l1.8 6a1 1 0 0 1-1 1.2L3 15"/><circle cx="12" cy="12" r="2"/></svg>
          <h2 className="text-xl font-headline text-foreground mb-2">Aguardando Novas Oportunidades</h2>
          <p className="text-muted-foreground text-center">
            {!isProUser && fixedDailyCallsForFreeUser.length < DAILY_LIMIT_FREE_USER && `Você pode ver ${DAILY_LIMIT_FREE_USER - fixedDailyCallsForFreeUser.length} call(s) gratuita(s) hoje assim que o sistema as gerar. `}
            Nossos analistas estão de olho!
            {!isProUser && <Link href="/dashboard/billing" className="text-primary underline ml-1">Faça upgrade para Pro</Link> } para acesso ilimitado.
          </p>
        </div>
      )}

      {!isProUser && !dailyLimitReached && fixedDailyCallsForFreeUser.length > 0 && fixedDailyCallsForFreeUser.length < DAILY_LIMIT_FREE_USER && (
         <Card className="md:col-span-1 lg:col-span-2 xl:col-span-3 bg-muted/50 border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Você ainda pode ver mais {DAILY_LIMIT_FREE_USER - fixedDailyCallsForFreeUser.length} alerta(s) gratuito(s) hoje quando o sistema os disponibilizar.
                Para acesso ilimitado e todos os recursos, <Link href="/dashboard/billing" className="text-primary underline">considere o MemeTrade Pro</Link>.
              </p>
            </CardContent>
          </Card>
       )}
    </div>
  );
}
