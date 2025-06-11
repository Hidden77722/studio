"use client";

import type { MemeCoinCall } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Info, AlertTriangle, Clock, Target, ShieldAlert, FileText } from "lucide-react";
import Image from "next/image";
import React from "react";
import { WhyThisCoinModal } from "./WhyThisCoinModal";

interface CallCardProps {
  call: MemeCoinCall;
}

export function CallCard({ call }: CallCardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Card className="w-full shadow-lg hover:shadow-primary/20 transition-shadow duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            {call.logoUrl ? (
              <Image 
                src={call.logoUrl} 
                alt={`${call.coinName} logo`} 
                width={40} 
                height={40} 
                className="rounded-full"
                data-ai-hint="coin logo" 
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-primary font-bold text-lg">
                {call.coinSymbol.substring(0,1)}
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-headline">{call.coinName} ({call.coinSymbol})</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                <Clock className="inline-block mr-1 h-3 w-3" /> Entry: {new Date(call.entryTime).toLocaleString()}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Live Call</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Reason for Entry
            </h4>
            <p className="text-sm">{call.reason}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground">Entry Price</p>
              <p className="font-semibold text-lg">${call.entryPrice.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground flex items-center">
                <Target className="h-3 w-3 mr-1 text-green-400" /> Profit Targets
              </p>
              <ul className="list-none space-y-0.5">
                {call.targets.map((target, index) => (
                  <li key={index} className="font-semibold text-green-400">
                    ${target.price.toLocaleString()} {target.percentage && `(${target.percentage})`}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground flex items-center">
                <ShieldAlert className="h-3 w-3 mr-1 text-red-400" /> Stop Loss
              </p>
              <p className="font-semibold text-red-400 text-lg">${call.stopLoss.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary" onClick={() => setIsModalOpen(true)}>
            <Info className="mr-2 h-4 w-4" /> Why this coin? (AI Analysis)
          </Button>
        </CardFooter>
      </Card>
      <WhyThisCoinModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coinName={call.coinName}
        technicalAnalysis={call.technicalAnalysisSummary}
        marketSentiment={call.marketSentimentSummary}
      />
    </>
  );
}
