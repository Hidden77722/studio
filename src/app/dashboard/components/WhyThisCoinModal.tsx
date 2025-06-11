"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { explainWhyThisCoin, type ExplainWhyThisCoinInput, type ExplainWhyThisCoinOutput } from "@/ai/flows/why-this-coin";
import { Loader2, Wand2 } from 'lucide-react';
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
  }, [isOpen]); // Re-fetch if modal is reopened and dependencies changed (though they shouldn't here)

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
      setError("Failed to generate AI explanation. Please try again.");
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
            AI Analysis: Why {coinName}?
          </DialogTitle>
          <DialogDescription>
            An AI-powered breakdown of the rationale behind this trade call.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-2 p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating insights...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
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
            Close
          </Button>
          {!isLoading && (explanation || error) && ( // Show refresh only if not loading and there's content or error
            <Button onClick={fetchExplanation} variant="ghost" className="text-primary hover:bg-primary/10">
              <Loader2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Analysis
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
