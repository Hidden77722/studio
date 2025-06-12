
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateOnchainTradeCall, type OnchainActivityInput, type OnchainTradeCallOutput } from "@/ai/flows/generate-onchain-trade-call-flow";
import { Loader2, BarChartHorizontalBig, AlertTriangle, WandSparkles, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import Link from "next/link";

const AI_CALL_LIMIT_KEY = 'memetrade_free_user_ai_call_limits';
const DAILY_LIMIT_COUNT = 1;

interface AiCallLimits {
  date: string;
  dexCallsMadeToday: number;
  onchainCallsMadeToday: number;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

export default function OnchainTradeCallPage() {
  const { isProUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // onchainCallResult will now store the full OnchainTradeCallOutput object
  const [onchainCallResult, setOnchainCallResult] = useState<OnchainTradeCallOutput | null>(null);
  const [onchainAiCallLimitReached, setOnchainAiCallLimitReached] = useState(false);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);

  useEffect(() => {
    if (isProUser === undefined) return; 

    if (isProUser) {
      setOnchainAiCallLimitReached(false);
      setLocalStorageChecked(true);
      return;
    }

    const today = getTodayString();
    let storedLimits: AiCallLimits = { date: today, dexCallsMadeToday: 0, onchainCallsMadeToday: 0 };
    
    try {
      const item = localStorage.getItem(AI_CALL_LIMIT_KEY);
      if (item) {
        const parsed = JSON.parse(item) as AiCallLimits;
        if (parsed.date === today) {
          storedLimits = parsed;
        } else {
          localStorage.setItem(AI_CALL_LIMIT_KEY, JSON.stringify(storedLimits));
        }
      } else {
        localStorage.setItem(AI_CALL_LIMIT_KEY, JSON.stringify(storedLimits));
      }
    } catch (e) {
      console.error("Error accessing localStorage for AI call limits:", e);
    }
    
    setOnchainAiCallLimitReached(storedLimits.onchainCallsMadeToday >= DAILY_LIMIT_COUNT);
    setLocalStorageChecked(true);
  }, [isProUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isProUser && onchainAiCallLimitReached) {
      setError("Você atingiu seu limite diário de chamadas de IA para este recurso como usuário gratuito.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOnchainCallResult(null);

    const input: OnchainActivityInput = {};
    const result = await generateOnchainTradeCall(input);
    setIsLoading(false);

    if (result.errorMessage) {
      console.error("Error generating onchain trade call from flow:", result.errorMessage);
      setError(`Falha ao gerar a call: ${result.errorMessage}`);
      setOnchainCallResult(null);
    } else if (result.tradeCall) {
      setOnchainCallResult(result); // Store the full result object
      setError(null);

      if (!isProUser) { // Only update limit if successful and free user
        const today = getTodayString();
        let currentLimits: AiCallLimits = { date: today, dexCallsMadeToday: 0, onchainCallsMadeToday: 0 };
        try {
          const item = localStorage.getItem(AI_CALL_LIMIT_KEY);
          if (item) {
            const parsed = JSON.parse(item) as AiCallLimits;
            if (parsed.date === today) {
              currentLimits = parsed;
            }
          }
        } catch (errStorageRead) {
          console.error("Error reading localStorage for AI call limits update:", errStorageRead);
        }
        currentLimits.onchainCallsMadeToday = (currentLimits.onchainCallsMadeToday || 0) + 1;
        currentLimits.date = today; 
        try {
          localStorage.setItem(AI_CALL_LIMIT_KEY, JSON.stringify(currentLimits));
        } catch(errStorageWrite) {
          console.error("Error writing localStorage for AI call limits update:", errStorageWrite);
        }
        setOnchainAiCallLimitReached(currentLimits.onchainCallsMadeToday >= DAILY_LIMIT_COUNT);
      }
    } else {
      // Should not happen if the flow always returns either tradeCall or errorMessage
      console.error("Unexpected response from generateOnchainTradeCall:", result);
      setError("Resposta inesperada da IA ao gerar a call.");
      setOnchainCallResult(null);
    }
  };

  const showGenerateButton = localStorageChecked && (isProUser || !onchainAiCallLimitReached);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <BarChartHorizontalBig className="mr-3 h-8 w-8 text-primary" />
          Gerador de Call On-Chain (Alpha Caller IA)
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Gerar Call On-Chain Simulada com IA</CardTitle>
          <CardDescription>
             {isProUser ? 
              "Clique no botão abaixo. A IA simulará a detecção de uma atividade on-chain relevante, analisará o cenário e gerará uma call de trade no estilo 'alpha caller'."
            :
              `Como usuário gratuito, você pode gerar ${DAILY_LIMIT_COUNT} call de trade on-chain por dia. ${onchainAiCallLimitReached ? 'Você já atingiu seu limite hoje.' : ''}`
            }
          </CardDescription>
        </CardHeader>
        {showGenerateButton && (
          <form onSubmit={handleSubmit}>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A IA criará um cenário de movimentação on-chain e fornecerá uma call de trade completa.
              </p>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || (!isProUser && onchainAiCallLimitReached)}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <WandSparkles className="mr-2 h-5 w-5" />}
                Gerar Call On-Chain com IA
              </Button>
            </CardFooter>
          </form>
        )}
        {!showGenerateButton && localStorageChecked && !isProUser && onchainAiCallLimitReached && (
            <CardContent>
                <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                    <Lock className="h-4 w-4 text-yellow-400" />
                    <AlertTitle>Limite Diário Atingido</AlertTitle>
                    <AlertDescription>
                        Você já utilizou sua call de IA (On-Chain) gratuita de hoje. 
                        Para calls ilimitadas, <Link href="/dashboard/billing" className="font-semibold underline hover:text-yellow-300">faça upgrade para o Pro</Link>.
                        Novas calls gratuitas estarão disponíveis amanhã.
                    </AlertDescription>
                </Alert>
            </CardContent>
        )}
         {!localStorageChecked && (
           <CardContent className="flex justify-center items-center p-6">
             <Loader2 className="h-6 w-6 animate-spin text-primary" />
             <p className="ml-2 text-muted-foreground">Verificando permissões...</p>
           </CardContent>
        )}
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-2 p-8 bg-card rounded-lg shadow-md mt-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Analisando e gerando call...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro na Geração</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {onchainCallResult && onchainCallResult.tradeCall && !isLoading && (
          <Card className="max-w-2xl mx-auto shadow-xl mt-6 bg-card border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-lg flex items-center justify-between text-primary">
                <span>🚨 ALERTA DE MOVIMENTAÇÃO ON-CHAIN (SIMULADO PELA IA)! 🚨</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm whitespace-pre-wrap bg-muted/20 p-4 rounded-md">
                {onchainCallResult.tradeCall}
            </CardContent>
             <CardFooter>
                <details className="w-full text-xs rounded-md border border-border p-2 hover:bg-muted/10 transition-colors">
                    <summary className="text-muted-foreground cursor-pointer">Ver JSON completo da Resposta da IA</summary>
                    <div className="font-mono whitespace-pre-wrap bg-muted/40 p-1.5 rounded mt-1 max-h-40 overflow-y-auto">
                        {JSON.stringify(onchainCallResult, null, 2)}
                    </div>
                </details>
            </CardFooter>
          </Card>
      )}
    </div>
  );
}
