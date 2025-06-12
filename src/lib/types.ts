
export interface MemeCoinCall {
  id: string;
  coinName: string;
  coinSymbol: string;
  logoUrl?: string;
  logoAiHint?: string;
  entryTime: string;
  reason: string;
  entryPrice: number;
  targets: { price: number; percentage?: string }[];
  stopLoss: number;
  // For AI explanation
  technicalAnalysisSummary: string;
  marketSentimentSummary: string;
  // Data from DexScreener (mocked for now)
  volume24h?: number;
  liquidityUSD?: number;
}

export interface HistoricalCall extends Omit<MemeCoinCall, 'technicalAnalysisSummary' | 'marketSentimentSummary' | 'logoAiHint' | 'volume24h' | 'liquidityUSD'> { // logoAiHint será adicionado abaixo especificamente
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

// Tipo para dados de mercado, simulando CoinGecko
export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string; // URL para a imagem do logo
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export interface HotPair {
  id: string;
  name: string;
  symbol: string;
  pairAddress: string;
  exchange: string;
  reason: string;
  mockVolume24h: number;
  mockLiquidity: number;
  priceChange24h?: number;
  logoUrl?: string;
  logoAiHint?: string;
  dexScreenerUrl?: string;
}

// Tipos para o fluxo de análise de sentimento
export interface MarketSentimentInput {
  coinName: string;
  description: string;
  volume24h: number;
  priceChange24h: number; // em porcentagem, ex: 10.5 para 10.5%
}

export type HypePotential = "Alta" | "Moderada" | "Baixa";

export interface MarketSentimentOutput {
  hypePotential: HypePotential;
  justification: string;
}

// Tipos para o novo fluxo de geração de call de trade
// GenerateTradeCallInput is an empty object as the flow fetches its own data.
export type GenerateTradeCallInput = Record<string, never>; // Equivalent to {}

export interface GeneratedTradeCallOutput {
  moeda: string; 
  hora_call?: string; 
  entrada?: string; 
  alvos?: Array<{ preco: string; observacao?: string }>; 
  stop?: string; 
  motivo?: string; 
  risco?: "Baixo" | "Médio" | "Alto" | "Nenhum"; 
}

