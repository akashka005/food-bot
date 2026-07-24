import { embed } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { prisma, Prisma } from '@smartfood/database';

// We use OpenAI for embeddings since Groq doesn't offer embedding models yet
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Note: We need this for embeddings!
});

const embeddingModel = openai.embedding('text-embedding-3-small');

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}

export interface SemanticSearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryType: string;
  stallName: string;
  similarity: number;
}

/**
 * Searches the menu items using pgvector and cosine similarity (or text search if no OpenAI API Key).
 */
export async function searchMenu(query: string, limit: number = 5): Promise<SemanticSearchResult[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('No OPENAI_API_KEY found, falling back to basic text search');
    const searchPattern = `%${query.toLowerCase().replace(/\s+/g, '%')}%`;
    const results = await prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        dietaryType: string;
        stallName: string;
      }>
    >`
      SELECT 
        m."id", 
        m."name", 
        m."description", 
        m."price", 
        m."category", 
        m."dietaryType",
        s."name" as "stallName"
      FROM "MenuItem" m
      JOIN "FoodStall" s ON m."stallId" = s."id"
      WHERE m."status" = 'AVAILABLE' 
        AND (LOWER(m."name") LIKE ${searchPattern} OR LOWER(s."name") LIKE ${searchPattern})
      LIMIT ${limit};
    `;

    return results.map((row: any) => ({
      ...row,
      similarity: 1.0, // mock high similarity for text match
    }));
  }

  // Generate embedding for the user's query
  const queryEmbedding = await generateEmbedding(query);
  
  // Convert embedding to a PostgreSQL vector literal string format: '[0.1, 0.2, ...]'
  const vectorStr = `[${queryEmbedding.join(',')}]`;

  // Use raw SQL to find the closest items using Cosine Distance (<=>)
  // Distance is 1 - similarity. So closer to 0 is better.
  const results = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      category: string;
      dietaryType: string;
      stallName: string;
      distance: number;
    }>
  >`
    SELECT 
      m."id", 
      m."name", 
      m."description", 
      m."price", 
      m."category", 
      m."dietaryType",
      s."name" as "stallName",
      e."embedding" <=> ${vectorStr}::vector as distance
    FROM "MenuItem" m
    JOIN "MenuItemEmbedding" e ON m."id" = e."menuItemId"
    JOIN "FoodStall" s ON m."stallId" = s."id"
    WHERE m."status" = 'AVAILABLE'
    ORDER BY distance ASC
    LIMIT ${limit};
  `;

  // Map to similarity (1 - distance)
  return results.map((row: any) => ({
    ...row,
    similarity: 1 - row.distance,
  }));
}
