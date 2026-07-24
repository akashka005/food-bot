import { generateText, tool, CoreMessage } from 'ai';
import { z } from 'zod';
import { models } from './provider';
import { SYSTEM_PROMPT } from './prompts';
import { searchMenu } from './rag';
import { getConversationHistory, addMessageToHistory } from './memory';

export async function processChatRequest(studentId: string, userMessage: string) {
  // 1. Get History
  const { conversationId, messages } = await getConversationHistory(studentId);
  
  // Transform Prisma messages to CoreMessage
  const coreMessages: CoreMessage[] = messages.map((m: any) => ({
    role: m.role.toLowerCase() as 'user' | 'assistant' | 'system',
    content: m.content,
  }));

  // Append current user message
  coreMessages.push({ role: 'user', content: userMessage });

  // Save user message to DB
  await addMessageToHistory(conversationId, 'USER', userMessage);

  // 2. Call the Agent with Tools
  const { text, steps } = await generateText({
    model: models.reasoning,
    system: SYSTEM_PROMPT,
    messages: coreMessages,
    maxSteps: 3, // Allow the agent to call tools and respond
    tools: {
      searchMenu: tool({
        description: 'Search the LPU SmartFood campus menu for specific dishes, categories, or dietary preferences.',
        parameters: z.object({
          query: z.string().describe('The search query (e.g., "spicy paneer", "vegan options", "cold coffee").'),
        }),
        execute: async ({ query }) => {
          const results = await searchMenu(query, 5);
          return results;
        },
      }),
      getQueueStatus: tool({
        description: 'Check how busy a specific stall is before placing an order.',
        parameters: z.object({
          stallId: z.string(),
        }),
        execute: async ({ stallId }) => {
          // Mock queue wait time until Queue service is fully integrated in Phase 4
          return { stallId, estimatedWaitMinutes: Math.floor(Math.random() * 20) + 5 };
        },
      }),
      placeOrder: tool({
        description: 'Initiate placing an order for the user.',
        parameters: z.object({
          menuItemId: z.string(),
          quantity: z.number().min(1),
        }),
        execute: async ({ menuItemId, quantity }) => {
          return { success: true, message: "Order placed successfully! (Mocked)" };
        },
      })
    },
  });

  // Clean up any hallucinated XML function tags that might leak from Llama's raw output
  const cleanText = text.replace(/<function[^>]*>.*?<\/function>/gs, '').replace(/<function[^>]*>/gs, '').trim();

  // 3. Save Assistant Response
  await addMessageToHistory(conversationId, 'ASSISTANT', cleanText);

  return cleanText;
}
