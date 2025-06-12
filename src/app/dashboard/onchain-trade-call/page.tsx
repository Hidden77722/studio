
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateOnchainTradeCall, type OnchainActivityInput, type OnchainTradeCallOutput } from "@/ai/flows/generate-onchain-trade-call-flow";
import { Loader2, BarChartHorizontalBig, AlertTriangle, WandSparkles, Clock, TrendingUp, ShieldAlert, Search, Eye, XCircle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const exampleJsonInput = `{
  "wallet": "0xWhale123...",
  "action": "buy",
  "token": "$PEPE",
  "amount_tokens": 3400000000,
  "amount_usd": 12400,
  "timestamp": "2025-06-11T17:41:00Z",
  "contract": "0xPEPE...",
  "note": "Carteira já teve 6 trades lucrativos nas últimas semanas"
}`;

export default function OnchainTradeCallPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onchainCallResult, setOnchainCallResult] = useState<OnchainTradeCallOutput | null>(null);
  const [jsonInput, setJsonInput] = useState(exampleJsonInput);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOnchainCallResult(null);

    try {
      const parsedInput: OnchainActivityInput = JSON.parse(jsonInput);
      // Validação básica do timestamp (deve ser ISO string)
      if (isNaN(new Date(parsedInput.timestamp).getTime())) {
          throw new Error("Formato de timestamp inválido. Use o formato ISO UTC (ex: 2025-06-11T17:41:00Z).");
      }
      const result = await generateOnchainTradeCall(parsedInput);
      setOnchainCallResult(result);
    } catch (e) {
      console.error("Error generating onchain trade call:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocorreu um erro desconhecido ao processar o JSON ou gerar a call.";
      if (e instanceof SyntaxError) {
        setError(`Erro de sintaxe no JSON: ${errorMessage}`);
      } else {
        setError(`Falha ao gerar a call: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestionBadgeVariant = (sugestao?: OnchainTradeCallOutput['sugestao_acao']) => {
    if (!sugestao) return "secondary";
    switch (sugestao) {
      case "ENTRAR": return "default"; // Greenish if primary is green, or default primary
      case "OBSERVAR": return "secondary"; // Yellowish or neutral
      case "EVITAR": return "outline"; // Orangish or grey
      case "SAIR": return "destructive"; // Reddish
      default: return "secondary";
    }
  };

  const getSuggestionBadgeClasses = (sugestao?: OnchainTradeCallOutput['sugestao_acao']) => {
    if (!sugestao) return "";
    switch (sugestao) {
      case "ENTRAR": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "OBSERVAR": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "EVITAR": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "SAIR": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "";
    }
  };

  const getSuggestionIcon = (sugestao?: OnchainTradeCallOutput['sugestao_acao']) => {
    if (!sugestao) return <Info className="mr-1 h-3.5 w-3.5" />;
    switch (sugestao) {
      case "ENTRAR": return <CheckCircle className="mr-1 h-3.5 w-3.5" />;
      case "OBSERVAR": return <Eye className="mr-1 h-3.5 w-3.5" />;
      case "EVITAR": return <ShieldAlert className="mr-1 h-3.5 w-3.5" />;
      case "SAIR": return <XCircle className="mr-1 h-3.5 w-3.5" />;
      default: return <Info className="mr-1 h-3.5 w-3.5" />;
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
          <CardTitle className="font-headline text-2xl">Analisar Atividade On-Chain</CardTitle>
          <CardDescription>
            Cole os dados de atividade on-chain (formato JSON) abaixo. A IA irá analisá-los e gerar uma call de trade no estilo "alpha caller".
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jsonInput">Dados da Atividade On-Chain (JSON)</Label>
              <Textarea
                id="jsonInput"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Cole o JSON aqui..."
                rows={10}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Certifique-se que o JSON contém os campos: wallet, action, token, amount_tokens, amount_usd, timestamp (ISO UTC), contract (opcional), note (opcional).
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <WandSparkles className="mr-2 h-5 w-5" />}
              Gerar Call com IA
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
                <span>🚨 ALERTA DE MOVIMENTAÇÃO ON-CHAIN! 🚨</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p><Clock className="inline-block mr-1.5 h-4 w-4 text-primary/80" /> <strong className="text-muted-foreground">HORÁRIO (UTC):</strong> {onchainCallResult.horario_utc}</p>
                <p><TrendingUp className="inline-block mr-1.5 h-4 w-4 text-primary/80" /> <strong className="text-muted-foreground">TIPO DE AÇÃO:</strong> <span className="font-semibold">{onchainCallResult.tipo_acao}</span></p>
                <p><BarChartHorizontalBig className="inline-block mr-1.5 h-4 w-4 text-primary/80" /> <strong className="text-muted-foreground">QUANTIDADE:</strong> {onchainCallResult.quantidade_tokens_usd}</p>
                <p><Info className="inline-block mr-1.5 h-4 w-4 text-primary/80 align-top" /> <strong className="text-muted-foreground align-top">JUSTIFICATIVA:</strong> {onchainCallResult.justificativa}</p>
                <div className="flex items-center">
                    <span className="mr-2">{getSuggestionIcon(onchainCallResult.sugestao_acao)}</span>
                    <strong className="text-muted-foreground">SUGESTÃO DE AÇÃO:</strong>
                    <Badge 
                        variant={getSuggestionBadgeVariant(onchainCallResult.sugestao_acao)} 
                        className={`ml-2 ${getSuggestionBadgeClasses(onchainCallResult.sugestao_acao)}`}
                    >
                        {onchainCallResult.sugestao_acao}
                    </Badge>
                </div>
                 <details className="mt-4 rounded-md border border-border p-2 hover:bg-muted/10 transition-colors text-xs">
                  <summary className="text-muted-foreground cursor-pointer">Ver JSON completo da Call</summary>
                  <div className="font-mono whitespace-pre-wrap bg-muted/40 p-1.5 rounded mt-1 max-h-40 overflow-y-auto">
                      {JSON.stringify(onchainCallResult, null, 2)}
                  </div>
              </details>
            </CardContent>
          </Card>
      )}
    </div>
  );
}

    