
export interface MemeCoinCall {
  id: string;
  coinName: string;
  coinSymbol: string;
  logoUrl?: string;
  logoAiHint?: string; // Adicionado
  entryTime: string;
  reason: string;
  entryPrice: number;
  targets: { price: number; percentage?: string }[];
  stopLoss: number;
  // For AI explanation
  technicalAnalysisSummary: string;
  marketSentimentSummary: string;
}

export interface HistoricalCall extends Omit<MemeCoinCall, 'technicalAnalysisSummary' | 'marketSentimentSummary' | 'logoAiHint'> { // logoAiHint será adicionado abaixo especificamente
  logoAiHint?: string; // Adicionado
  exitTime?: string;
  exitPrice?: number;
  result: 'Win' | 'Loss' | 'Pending';
  profitOrLossAmount?: number;
  profitOrLossPercentage?: string;
}

export interface UserPerformance {
  accuracy: number;
  averageProfit: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  // Data for charts
  accuracyOverTime: { date: string; value: number }[]; // 'value' for chart component
  profitOverTime: { date: string; value: number }[]; // 'value' for chart component
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  subscriptionTier: 'Monthly' | 'Annual' | 'None';
  subscriptionEndDate?: string;
}

export interface TwitterInfluencer {
  id: string;
  name: string;
  handle: string;
  description: string;
  twitterUrl: string;
  avatarUrl: string;
  dataAiHintAvatar?: string;
}

// Novo tipo para dados do CoinGecko
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}
