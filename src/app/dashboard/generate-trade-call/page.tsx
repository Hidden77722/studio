
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { generateTradeCall, type GeneratedTradeCallOutput } from "@/ai/flows/generate-trade-call-flow";
import { Loader2, Wand2, AlertTriangle, FileJson, TrendingUp, ShieldAlert, BarChart2, SearchSlash, Server,Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
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

export default function GenerateTradeCallPage() {
  const { isProUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tradeCallResult, setTradeCallResult] = useState<GeneratedTradeCallOutput | null>(null);
  const [dexAiCallLimitReached, setDexAiCallLimitReached] = useState(false);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);

  useEffect(() => {
    if (isProUser === undefined) return; // Wait for auth context to load

    if (isProUser) {
      setDexAiCallLimitReached(false);
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
          // Reset for new day
          localStorage.setItem(AI_CALL_LIMIT_KEY, JSON.stringify(storedLimits));
        }
      } else {
        localStorage.setItem(AI_CALL_LIMIT_KEY, JSON.stringify(storedLimits));
      }
    } catch (e) {
      console.error("Error accessing localStorage for AI call limits:", e);
      // Proceed as if limit not reached if localStorage fails
    }
    
    setDexAiCallLimitReached(storedLimits.dexCallsMadeToday >= DAILY_LIMIT_COUNT);
    setLocalStorageChecked(true);
  }, [isProUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isProUser && dexAiCallLimitReached) {
      setError("Você atingiu seu limite diário de chamadas de IA para este recurso como usuário gratuito.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTradeCallResult(null);

    try {
      const result = await generateTradeCall();
      setTradeCallResult(result);

      if (!isProUser && result.moeda !== "Nenhuma call no momento") {
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
        } catch (e) {
          console.error("Error reading localStorage for AI call limits update:", e);
        }
        currentLimits.dexCallsMadeToday = (currentLimits.dexCallsMadeToday || 0) + 1;
        currentLimits.date = today; // Ensure date is current
        try {
          localStorage.setItem(AI_CALL_LIMIT_KEY, JSON.stringify(currentLimits));
        } catch (e) {
           console.error("Error writing localStorage for AI call limits update:", e);
        }
        setDexAiCallLimitReached(currentLimits.dexCallsMadeToday >= DAILY_LIMIT_COUNT);
      }
    } catch (e) {
      console.error("Error generating AI trade call:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocorreu um erro desconhecido.";
      setError(`Falha ao gerar a call de trade com IA: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadgeVariant = (risco?: GeneratedTradeCallOutput['risco']) => {
    if (!risco || risco === "Nenhum") return "secondary";
    switch (risco) {
      case "Baixo":
        return "default";
      case "Médio":
        return "secondary";
      case "Alto":
        return "destructive";
      default:
        return "outline";
    }
  };
  const getRiskBadgeClasses = (risco?: GeneratedTradeCallOutput['risco']) => {
    if (!risco || risco === "Nenhum") return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    switch (risco) {
      case "Baixo":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Médio":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Alto":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "";
    }
  };

  const showGenerateButton = localStorageChecked && (isProUser || !dexAiCallLimitReached);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Wand2 className="mr-3 h-8 w-8 text-primary" />
          Gerador de Call de Trade com IA (DexScreener)
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Gerar Call de Trade Automatizada</CardTitle>
          <CardDescription>
            {isProUser ? 
              "Clique no botão abaixo. A IA buscará dados da DexScreener, analisará moedas promissoras, escolherá a melhor e gerará uma call."
            :
              `Como usuário gratuito, você pode gerar ${DAILY_LIMIT_COUNT} call de trade baseada em DexScreener por dia. ${dexAiCallLimitReached ? 'Você já atingiu seu limite hoje.' : ''}`
            }
          </CardDescription>
        </CardHeader>
        {showGenerateButton && (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-md text-sm text-muted-foreground">
                <Server className="inline-block mr-2 h-4 w-4" />
                Este processo envolve buscar dados em tempo real da API pública da DexScreener,
                filtrá-los e então usar a IA para análise. Pode levar alguns segundos.
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || (!isProUser && dexAiCallLimitReached)}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                Gerar Nova Call com IA
              </Button>
            </CardFooter>
          </form>
        )}
         {!showGenerateButton && localStorageChecked && !isProUser && dexAiCallLimitReached && (
          <CardContent>
            <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
              <Lock className="h-4 w-4 text-yellow-400" />
              <AlertTitle>Limite Diário Atingido</AlertTitle>
              <AlertDescription>
                Você já utilizou sua call de IA (DexScreener) gratuita de hoje.
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
          <p className="text-muted-foreground">Buscando dados e gerando call...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro na Geração</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {tradeCallResult && !isLoading && (
        tradeCallResult.moeda === "Nenhuma call no momento" ? (
          <Card className="max-w-2xl mx-auto shadow-xl mt-6">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <SearchSlash className="mr-2 h-5 w-5 text-muted-foreground" />
                Nenhuma Call Recomendada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A IA analisou os dados da DexScreener e concluiu que nenhuma moeda atende aos critérios para uma call clara no momento, ou não foi possível buscar dados.
              </p>
              {tradeCallResult.motivo && (
                 <div className="mt-3">
                    <Label className="text-sm font-medium text-muted-foreground">Justificativa da IA:</Label>
                    <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md mt-1">{tradeCallResult.motivo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto shadow-xl mt-6">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center justify-between">
                <span className="flex items-center"><FileJson className="mr-2 h-5 w-5 text-primary" />
                Call Gerada para {tradeCallResult.moeda}</span>
                 <Badge 
                    variant={getRiskBadgeVariant(tradeCallResult.risco)} 
                    className={getRiskBadgeClasses(tradeCallResult.risco)}
                 >
                  Risco: {tradeCallResult.risco || "N/D"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-md space-y-2">
                  <InfoItem icon={<BarChart2 className="h-4 w-4 text-primary/80"/>} label="Moeda:" value={tradeCallResult.moeda} />
                  {tradeCallResult.hora_call && <InfoItem label="Hora da Call (UTC):" value={tradeCallResult.hora_call} />}
                  {tradeCallResult.entrada && <InfoItem label="Entrada:" value={tradeCallResult.entrada} valueClassName="text-green-400 font-bold" />}
                  
                  {tradeCallResult.alvos && tradeCallResult.alvos.length > 0 && (
                    <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Alvos de Lucro:</Label>
                        {tradeCallResult.alvos.map((alvo, index) => (
                            <div key={index} className="flex items-center ml-4">
                                <TrendingUp className="h-4 w-4 mr-2 text-green-400"/>
                                <span className="text-sm text-foreground">Alvo {index + 1}: <span className="font-semibold text-green-400">{alvo.preco}</span></span>
                            </div>
                        ))}
                    </div>
                  )}
                  
                  {tradeCallResult.stop && <InfoItem icon={<ShieldAlert className="h-4 w-4 text-red-400"/>} label="Stop Loss:" value={tradeCallResult.stop} valueClassName="text-red-400 font-bold" />}
              </div>
              {tradeCallResult.motivo && (
                <div>
                    <Label className="text-sm font-medium text-muted-foreground">Motivo da Call:</Label>
                    <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md mt-1">{tradeCallResult.motivo}</p>
                </div>
              )}
              
              <details className="mt-4 rounded-md border border-border p-3 hover:bg-muted/10 transition-colors">
                  <summary className="text-xs text-muted-foreground cursor-pointer">Ver JSON completo</summary>
                  <div className="text-xs font-mono whitespace-pre-wrap bg-muted/40 p-2 rounded mt-2 max-h-60 overflow-y-auto">
                      {JSON.stringify(tradeCallResult, null, 2)}
                  </div>
              </details>

            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}

interface InfoItemProps {
    icon?: React.ReactNode;
    label: string;
    value?: string; 
    valueClassName?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, valueClassName }) => (
    <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="text-sm text-muted-foreground min-w-[120px]">{label}</span>
        {value && <span className={`text-sm text-foreground ${valueClassName || ''}`}>{value}</span>}
    </div>
);

    