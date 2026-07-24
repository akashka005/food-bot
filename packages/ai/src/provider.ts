import { createGroq } from '@ai-sdk/groq';
import * as dotenv from 'dotenv';
dotenv.config();

// Initialize the Groq provider
export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// We can define standard models here to easily switch them out later
export const models = {
  // 70b is great for reasoning/agents
  reasoning: groq('llama-3.3-70b-versatile'),
  
  // 8b is great for fast parsing and basic intent detection
  fast: groq('llama-3.1-8b-instant'),
};
