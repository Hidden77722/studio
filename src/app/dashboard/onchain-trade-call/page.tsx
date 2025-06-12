
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Textarea e Label não são mais necessários para o input JSON
import { generateOnchainTradeCall, type OnchainActivityInput, type OnchainTradeCallOutput } from "@/ai/flows/generate-onchain-trade-call-flow";
import { Loader2, BarChartHorizontalBig, AlertTriangle, WandSparkles } from 'lucide-react'; // Removidos ícones não utilizados diretamente na exibição da call
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// Badge não é mais necessário para exibir a sugestão separadamente

export default function OnchainTradeCallPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onchainCallResult, setOnchainCallResult] = useState<OnchainTradeCallOutput | null>(null);
  // jsonInput e o exemplo não são mais necessários

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOnchainCallResult(null);

    try {
      // O input para o fluxo agora é um objeto vazio
      const input: OnchainActivityInput = {};
      const result = await generateOnchainTradeCall(input);
      setOnchainCallResult(result);
    } catch (e) {
      console.error("Error generating onchain trade call:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocorreu um erro desconhecido ao gerar a call.";
      setError(`Falha ao gerar a call: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

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
            Clique no botão abaixo. A IA simulará a detecção de uma atividade on-chain relevante, analisará o cenário e gerará uma call de trade no estilo "alpha caller".
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          {/* CardContent não é mais necessário para o input, mas pode ser usado para a descrição */}
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A IA criará um cenário de movimentação on-chain e fornecerá uma call de trade completa.
            </p>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <WandSparkles className="mr-2 h-5 w-5" />}
              Gerar Call On-Chain com IA
            </Button>
          </CardFooter>
        </form>
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

      {onchainCallResult && !isLoading && (
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
