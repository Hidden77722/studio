"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { explainWhyThisCoin, type ExplainWhyThisCoinInput, type ExplainWhyThisCoinOutput } from "@/ai/flows/why-this-coin";
import { Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WhyThisCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinName: string;
  technicalAnalysis: string;
  marketSentiment: string;
}

export function WhyThisCoinModal({ isOpen, onClose, coinName, technicalAnalysis, marketSentiment }: WhyThisCoinModalProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !explanation && !isLoading) { // Only fetch if modal is open and no explanation yet
      fetchExplanation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Re-fetch if modal is reopened

  const fetchExplanation = async () => {
    setIsLoading(true);
    setError(null);
    setExplanation(null); 
    try {
      const input: ExplainWhyThisCoinInput = {
        coinName,
        technicalAnalysis,
        marketSentiment,
      };
      const result: ExplainWhyThisCoinOutput = await explainWhyThisCoin(input);
      setExplanation(result.explanation);
    } catch (e) {
      console.error("Error fetching AI explanation:", e);
      setError("Falha ao gerar a explicação da IA. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-headline">
            <Wand2 className="mr-2 h-6 w-6 text-primary" />
            Análise IA: Por que {coinName}?
          </DialogTitle>
          <DialogDescription>
            Uma análise detalhada, com tecnologia de IA, da lógica por trás deste alerta de trade.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-2 p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Gerando insights...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {explanation && !isLoading && (
            <div className="prose prose-sm dark:prose-invert prose-p:text-foreground prose-strong:text-primary max-w-none whitespace-pre-wrap">
              <p>{explanation}</p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between gap-2">
           <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {!isLoading && (explanation || error) && ( // Show refresh only if not loading and there's content or error
            <Button onClick={fetchExplanation} variant="ghost" className="text-primary hover:bg-primary/10">
              <Loader2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar Análise
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
