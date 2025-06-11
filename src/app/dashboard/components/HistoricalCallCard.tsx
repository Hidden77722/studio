import type { HistoricalCall } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, CheckCircle2, XCircle, Clock, CalendarDays, ArrowRightLeft } from "lucide-react";
import Image from "next/image";

interface HistoricalCallCardProps {
  call: HistoricalCall;
}

export function HistoricalCallCard({ call }: HistoricalCallProps) {
  const isWin = call.result === 'Win';
  const isLoss = call.result === 'Loss';
  const isPending = call.result === 'Pending';

  const getBadgeVariant = () => {
    if (isWin) return "success";
    if (isLoss) return "destructive";
    return "secondary";
  };
  
  const getBadgeClasses = () => {
    if (isWin) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (isLoss) return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"; // For Pending
  };


  return (
    <Card className="w-full shadow-md hover:shadow-primary/10 transition-shadow duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
           {call.logoUrl ? (
              <Image 
                src={call.logoUrl} 
                alt={`${call.coinName} logo`} 
                width={32} 
                height={32} 
                className="rounded-full"
                data-ai-hint="coin logo" 
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary font-bold">
                {call.coinSymbol.substring(0,1)}
              </div>
            )}
          <div>
            <CardTitle className="text-lg font-headline">{call.coinName} ({call.coinSymbol})</CardTitle>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
              <span><CalendarDays className="inline-block mr-1 h-3 w-3" /> Date: {new Date(call.entryTime).toLocaleDateString()}</span>
              {call.exitTime && <span><Clock className="inline-block mr-1 h-3 w-3" /> Duration: {getDuration(call.entryTime, call.exitTime)}</span>}
            </CardDescription>
          </div>
        </div>
         <Badge variant={"outline"} className={getBadgeClasses()}>
          {isWin && <CheckCircle2 className="mr-1 h-3.5 w-3.5" />}
          {isLoss && <XCircle className="mr-1 h-3.5 w-3.5" />}
          {isPending && <Clock className="mr-1 h-3.5 w-3.5" />}
          {call.result}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <InfoItem label="Entry Price" value={`$${call.entryPrice.toLocaleString()}`} />
          <InfoItem label="Exit Price" value={call.exitPrice ? `$${call.exitPrice.toLocaleString()}` : 'N/A'} />
          <InfoItem 
            label="P/L Amount" 
            value={call.profitOrLossAmount ? `${isWin ? '+' : ''}$${call.profitOrLossAmount.toLocaleString()}` : 'N/A'} 
            className={isWin ? 'text-green-400' : isLoss ? 'text-red-400' : ''}
          />
          <InfoItem 
            label="P/L %" 
            value={call.profitOrLossPercentage || 'N/A'}
            className={isWin ? 'text-green-400' : isLoss ? 'text-red-400' : ''}
          />
        </div>
        <div className="text-xs text-muted-foreground">
            <ArrowRightLeft className="inline-block mr-1 h-3 w-3" />
            Targets: {call.targets.map(t => `$${t.price}`).join(', ')} | Stop: ${call.stopLoss}
        </div>
      </CardContent>
    </Card>
  );
}

const InfoItem = ({ label, value, className }: { label: string; value: string | number; className?: string }) => (
  <div className="p-2 bg-muted/30 rounded-md">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`font-semibold ${className || ''}`}>{value}</p>
  </div>
);


function getDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  let diff = Math.abs(end - start) / 1000; // difference in seconds

  const days = Math.floor(diff / 86400);
  diff -= days * 86400;

  const hours = Math.floor(diff / 3600) % 24;
  diff -= hours * 3600;

  const minutes = Math.floor(diff / 60) % 60;

  let durationStr = "";
  if (days > 0) durationStr += `${days}d `;
  if (hours > 0) durationStr += `${hours}h `;
  if (minutes > 0 || (days === 0 && hours === 0)) durationStr += `${minutes}m`;
  
  return durationStr.trim() || "0m";
}

