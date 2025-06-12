
import { config } from 'dotenv';
config();

import '@/ai/flows/why-this-coin.ts';
import '@/ai/flows/market-sentiment-flow.ts';
import '@/ai/flows/generate-trade-call-flow.ts';
import '@/ai/flows/generate-onchain-trade-call-flow.ts'; // Added new flow
// Removed import for generate-2fa-setup-flow.ts

    