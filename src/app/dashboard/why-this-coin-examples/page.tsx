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
  const [coinName, setCoinName] = useState("ExampleCoin (EXC)");
  const [technicalAnalysis, setTechnicalAnalysis] = useState(
    "Price broke above key resistance at $0.50 with high volume. RSI shows bullish momentum, and MACD is crossing upwards. 50-day MA is about to cross above 200-day MA (Golden Cross)."
  );
  const [marketSentiment, setMarketSentiment] = useState(
    "Positive sentiment on social media platforms. Several influencers are discussing the coin. News of a potential partnership is driving hype. Fear & Greed index is in 'Greed' zone."
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
          AI-Powered Trade Rationale
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Test the "Why This Coin?" AI</CardTitle>
          <CardDescription>
            Input mock data to see how our AI explains the reasoning behind a trade call. This tool is integrated into each live call for real-time insights.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="coinName">Coin Name</Label>
              <Input
                id="coinName"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                placeholder="e.g., DogeBonk (DOBO)"
              />
            </div>
            <div>
              <Label htmlFor="technicalAnalysis">Technical Analysis Summary</Label>
              <Textarea
                id="technicalAnalysis"
                value={technicalAnalysis}
                onChange={(e) => setTechnicalAnalysis(e.target.value)}
                placeholder="Enter technical analysis points..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="marketSentiment">Market Sentiment Summary</Label>
              <Textarea
                id="marketSentiment"
                value={marketSentiment}
                onChange={(e) => setMarketSentiment(e.target.value)}
                placeholder="Enter market sentiment observations..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Wand2 className="mr-2 h-5 w-5" />
              Generate AI Explanation
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isModalOpen && ( // Conditionally render modal to ensure state is fresh on open
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
