
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Changed from Input
import { generateTradeCall, type GenerateTradeCallInput, type GeneratedTradeCallOutput } from "@/ai/flows/generate-trade-call-flow";
import { Loader2, Wand2, AlertTriangle, FileJson, TrendingUp, ShieldAlert, BarChart2, SearchSlash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function GenerateTradeCallPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tradeCallResult, setTradeCallResult] = useState<GeneratedTradeCallOutput | null>(null);

  const [marketAnalysisData, setMarketAnalysisData] = useState(
    "- PEPE: volume $150M, liquidez $20M, +5% 1h, +25% 24h, preço: $0.00001234\n- WIF: volume $100M, liquidez $15M, +2% 1h, +15% 24h, preço: $2.50\n- BONK: volume $80M, liquidez $10M, +8% 1h, +30% 24h, preço: $0.00002876"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTradeCallResult(null);

    if (!marketAnalysisData.trim()) {
      setError("Os dados de análise de mercado não podem estar vazios.");
      setIsLoading(false);
      return;
    }

    try {
      const input: GenerateTradeCallInput = {
        marketAnalysisData,
      };
      const result = await generateTradeCall(input);
      setTradeCallResult(result);
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


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Wand2 className="mr-3 h-8 w-8 text-primary" />
          Gerador de Call de Trade com IA (Multi-Moeda)
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Gerar Call de Trade Estratégica</CardTitle>
          <CardDescription>
            Insira os dados de mercado pré-filtrados de moedas promissoras. A IA escolherá a melhor e gerará uma call.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="marketAnalysisData">Dados de Análise de Mercado Pré-Filtrados</Label>
              <Textarea
                id="marketAnalysisData"
                value={marketAnalysisData}
                onChange={(e) => setMarketAnalysisData(e.target.value)}
                rows={6}
                placeholder="Exemplo:\n- MOEDA1: volume $X, liquidez $Y, +Z% 1h, +W% 24h, preço: $P\n- MOEDA2: ..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Forneça uma lista de moedas com seus dados relevantes. A IA analisará e escolherá uma.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
              Gerar Call Estratégica
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
                A IA analisou os dados fornecidos e concluiu que nenhuma moeda apresenta uma oportunidade de trade clara no momento.
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
    value?: string; // Made value optional
    valueClassName?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, valueClassName }) => (
    <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="text-sm text-muted-foreground min-w-[120px]">{label}</span>
        {value && <span className={`text-sm text-foreground ${valueClassName || ''}`}>{value}</span>}
    </div>
);

