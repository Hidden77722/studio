
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// import {openAI} from '@genkit-ai/openai'; // Temporarily remove OpenAI plugin

export const ai = genkit({
  plugins: [
    googleAI(),
    // openAI() // Temporarily remove OpenAI plugin
  ],
  model: 'googleai/gemini-2.0-flash', 
});

