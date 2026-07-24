import { prisma } from '@smartfood/database';

export interface RecommendationResult {
  menuItemId: string;
  name: string;
  price: number;
  description: string;
  stallName: string;
  score: number;
  reasons: string[];
}

/**
 * Collaborative filtering: "Students like you also ordered..."
 * Finds items frequently ordered by students with similar order histories.
 */
async function getCollaborativeRecommendations(
  studentId: string,
  limit: number
): Promise<string[]> {
  // Get the student's most ordered items
  const studentOrders = await prisma.orderItem.findMany({
    where: { order: { studentId, status: { not: 'CANCELLED' } } },
    select: { menuItemId: true },
    take: 50,
  });
  const studentItemIds = [...new Set(studentOrders.map((o) => o.menuItemId))];

  if (studentItemIds.length === 0) return [];

  // Find other students who ordered the same items
  const similarStudentOrders = await prisma.orderItem.findMany({
    where: {
      menuItemId: { in: studentItemIds },
      order: { studentId: { not: studentId } },
    },
    select: { order: { select: { studentId: true } } },
    take: 200,
  });
  const similarStudentIds = [
    ...new Set(
      similarStudentOrders.map((o) => o.order.studentId).filter(Boolean) as string[]
    ),
  ];

  if (similarStudentIds.length === 0) return [];

  // Get what those similar students ordered that this student hasn't tried
  const recommendations = await prisma.orderItem.groupBy({
    by: ['menuItemId'],
    where: {
      order: {
        studentId: { in: similarStudentIds },
        status: { not: 'CANCELLED' },
      },
      menuItemId: { notIn: studentItemIds },
    },
    _count: { menuItemId: true },
    orderBy: { _count: { menuItemId: 'desc' } },
    take: limit,
  });

  return recommendations.map((r) => r.menuItemId);
}

/**
 * Content-based filtering: Items similar to the student's favorites and dietary preferences.
 */
async function getContentBasedRecommendations(
  studentId: string,
  limit: number
): Promise<string[]> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { dietaryPreference: true, favoriteFoods: { select: { menuItemId: true } } },
  });

  if (!student) return [];

  const favoriteItemIds = student.favoriteFoods.map((f) => f.menuItemId);

  // Find items in the same category/dietary type as favorites
  const favoriteItems = await prisma.menuItem.findMany({
    where: { id: { in: favoriteItemIds } },
    select: { categoryId: true, dietaryType: true },
  });

  const categoryIds = [...new Set(favoriteItems.map((i) => i.categoryId).filter(Boolean) as string[])];
  const dietaryTypes = [...new Set(favoriteItems.map((i) => i.dietaryType))];

  const similar = await prisma.menuItem.findMany({
    where: {
      status: 'AVAILABLE',
      id: { notIn: favoriteItemIds },
      OR: [
        { categoryId: { in: categoryIds } },
        { dietaryType: { in: dietaryTypes } },
      ],
    },
    select: { id: true },
    take: limit,
    orderBy: { rating: 'desc' },
  });

  return similar.map((i) => i.id);
}

/**
 * Popularity-based: Trending items on campus right now.
 */
async function getTrendingRecommendations(limit: number): Promise<string[]> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const trending = await prisma.orderItem.groupBy({
    by: ['menuItemId'],
    where: {
      order: {
        createdAt: { gte: oneDayAgo },
        status: { not: 'CANCELLED' },
      },
    },
    _count: { menuItemId: true },
    orderBy: { _count: { menuItemId: 'desc' } },
    take: limit,
  });

  return trending.map((r) => r.menuItemId);
}

/**
 * Hybrid Recommendation Engine: Combines collaborative, content-based, and trending signals.
 */
export async function getRecommendations(
  studentId: string,
  limit: number = 10
): Promise<RecommendationResult[]> {
  const [collaborative, contentBased, trending] = await Promise.all([
    getCollaborativeRecommendations(studentId, limit),
    getContentBasedRecommendations(studentId, limit),
    getTrendingRecommendations(limit),
  ]);

  // Score items: collaborative=3pts, content=2pts, trending=1pt
  const scoreMap = new Map<string, { score: number; reasons: string[] }>();

  const addScore = (ids: string[], points: number, reason: string) => {
    ids.forEach((id) => {
      const existing = scoreMap.get(id) || { score: 0, reasons: [] };
      existing.score += points;
      if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
      scoreMap.set(id, existing);
    });
  };

  addScore(collaborative, 3, 'Students like you also love this');
  addScore(contentBased, 2, 'Matches your taste profile');
  addScore(trending, 1, 'Trending on campus today');

  // Sort by score and take top `limit`
  const topItemIds = [...scoreMap.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, limit)
    .map(([id]) => id);

  if (topItemIds.length === 0) return [];

  // Fetch full item details
  const items = await prisma.menuItem.findMany({
    where: { id: { in: topItemIds }, status: 'AVAILABLE' },
    include: { stall: { select: { name: true } } },
  });

  return items
    .map((item) => {
      const scoreInfo = scoreMap.get(item.id) || { score: 0, reasons: [] };
      return {
        menuItemId: item.id,
        name: item.name,
        price: Number(item.price),
        description: item.description || '',
        stallName: item.stall.name,
        score: scoreInfo.score,
        reasons: scoreInfo.reasons,
      };
    })
    .sort((a, b) => b.score - a.score);
}
