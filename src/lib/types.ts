export interface MemeCoinCall {
  id: string;
  coinName: string;
  coinSymbol: string;
  logoUrl?: string;
  entryTime: string; 
  reason: string; 
  entryPrice: number;
  targets: { price: number; percentage?: string }[];
  stopLoss: number;
  // For AI explanation
  technicalAnalysisSummary: string;
  marketSentimentSummary: string;
}

export interface HistoricalCall extends Omit<MemeCoinCall, 'technicalAnalysisSummary' | 'marketSentimentSummary'> {
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

export interface MockTweet {
  id: string;
  userName: string;
  userHandle: string;
  avatarUrl: string;
  content: string;
  timestamp: string; 
  likes: number;
  retweets: number;
  replies: number;
  imageUrl?: string;
  coinTags?: string[];
}
