
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WhyThisCoinModal } from "@/app/dashboard/components/WhyThisCoinModal";
import { Lightbulb, Wand2 } from 'lucide-react';

export default function WhyThisCoinExamplesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coinName, setCoinName] = useState("ApeMax (APEMAX)");
  const [technicalAnalysis, setTechnicalAnalysis] = useState(
    "APEMAX rompeu uma importante resistência em $0.005 com volume explosivo. RSI em 75, indicando forte momentum de compra, mas ainda não sobrecomprado em prazos maiores. MACD cruzou para cima, sinalizando início de tendência de alta. Médias móveis exponenciais (9 e 21 dias) prestes a realizar um 'cruzamento dourado' no gráfico de 4 horas."
  );
  const [marketSentiment, setMarketSentiment] = useState(
    "Intenso burburinho sobre APEMAX no Twitter e Reddit nas últimas 12 horas. A hashtag #APEMAXToTheMoon está em alta. Grandes influenciadores de cripto estão postando sobre potencial de 100x. Comunidade no Telegram extremamente ativa e otimista, com menções a 'queima de tokens' e 'novas listagens em corretoras'. Volume na Axiom Trade aumentou 300% nas últimas horas, indicando forte interesse comprador."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <Lightbulb className="mr-3 h-8 w-8 text-primary" />
          Lógica de Trade com IA
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Teste a IA "Por que esta Moeda?"</CardTitle>
          <CardDescription>
            Insira dados fictícios para ver como nossa IA explica o racional por trás de um alerta de trade. Esta ferramenta é integrada a cada alerta ao vivo para insights em tempo real.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="coinName">Nome da Moeda</Label>
              <Input
                id="coinName"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                placeholder="ex: DogeBonk (DOBO)"
              />
            </div>
            <div>
              <Label htmlFor="technicalAnalysis">Resumo da Análise Técnica</Label>
              <Textarea
                id="technicalAnalysis"
                value={technicalAnalysis}
                onChange={(e) => setTechnicalAnalysis(e.target.value)}
                placeholder="Insira pontos da análise técnica..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="marketSentiment">Resumo do Sentimento de Mercado</Label>
              <Textarea
                id="marketSentiment"
                value={marketSentiment}
                onChange={(e) => setMarketSentiment(e.target.value)}
                placeholder="Insira observações do sentimento de mercado, incluindo menções a plataformas como Axiom Trade..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Wand2 className="mr-2 h-5 w-5" />
              Gerar Explicação da IA
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isModalOpen && ( 
        <WhyThisCoinModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          coinName={coinName}
          technicalAnalysis={technicalAnalysis}
          marketSentiment={marketSentiment}
        />
      )}
    </div>
  );
}
