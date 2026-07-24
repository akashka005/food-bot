import { prisma } from '@smartfood/database';

export interface StallMetrics {
  stallId: string;
  date: Date;
  totalOrders: number;
  totalRevenue: number;
  avgWaitMinutes: number;
  peakHour: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeStudents: number;
  avgOrderValue: number;
  topStalls: { stallId: string; stallName: string; revenue: number }[];
  topItems: { menuItemId: string; itemName: string; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
}

/**
 * Platform-wide stats for the Admin dashboard.
 */
export async function getPlatformStats(days: number = 7): Promise<DashboardStats> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalRevenueResult, totalOrders, activeStudents, topStallsRaw, topItemsRaw, revenueByDayRaw] =
    await Promise.all([
      prisma.payment.aggregate({
        where: { status: 'PAID', createdAt: { gte: since } },
        _sum: { amount: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: since }, status: { not: 'CANCELLED' } } }),
      prisma.student.count({ where: { lastLoginAt: { gte: since } } }),
      prisma.order.groupBy({
        by: ['stallId'],
        where: { createdAt: { gte: since }, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 5,
      }),
      prisma.orderItem.groupBy({
        by: ['menuItemId'],
        where: { order: { createdAt: { gte: since }, status: { not: 'CANCELLED' } } },
        _count: { menuItemId: true },
        orderBy: { _count: { menuItemId: 'desc' } },
        take: 5,
      }),
      prisma.$queryRaw<{ date: string; revenue: number }[]>`
        SELECT DATE("createdAt")::text as date, SUM(amount) as revenue
        FROM "payments"
        WHERE "status" = 'PAID' AND "createdAt" >= ${since}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
    ]);

  const totalRevenue = Number(totalRevenueResult._sum?.amount || 0);

  // Resolve stall names
  const stallIds = topStallsRaw.map((s) => s.stallId);
  const stalls = await prisma.foodStall.findMany({
    where: { id: { in: stallIds } },
    select: { id: true, name: true },
  });
  const stallMap = new Map(stalls.map((s) => [s.id, s.name]));

  // Resolve menu item names
  const menuItemIds = topItemsRaw.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
    select: { id: true, name: true },
  });
  const menuItemMap = new Map(menuItems.map((m) => [m.id, m.name]));

  return {
    totalRevenue,
    totalOrders,
    activeStudents,
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    topStalls: topStallsRaw.map((s) => ({
      stallId: s.stallId,
      stallName: stallMap.get(s.stallId) || 'Unknown',
      revenue: Number(s._sum.totalAmount || 0),
    })),
    topItems: topItemsRaw.map((i) => ({
      menuItemId: i.menuItemId,
      itemName: menuItemMap.get(i.menuItemId) || 'Unknown',
      count: i._count.menuItemId,
    })),
    revenueByDay: revenueByDayRaw.map((r) => ({
      date: r.date,
      revenue: Number(r.revenue),
    })),
  };
}

/**
 * Vendor-specific stats for their dashboard.
 */
export async function getVendorStats(stallId: string, days: number = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [revenue, orders, avgRating, topItems] = await Promise.all([
    prisma.payment.aggregate({
      where: { order: { stallId }, status: 'PAID', createdAt: { gte: since } },
      _sum: { amount: true },
    }),
    prisma.order.count({
      where: { stallId, createdAt: { gte: since }, status: { not: 'CANCELLED' } },
    }),
    prisma.review.aggregate({
      where: { stallId, createdAt: { gte: since } },
      _avg: { rating: true },
    }),
    prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: { order: { stallId, createdAt: { gte: since } } },
      _count: { menuItemId: true },
      orderBy: { _count: { menuItemId: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    totalRevenue: Number(revenue._sum?.amount || 0),
    totalOrders: orders,
    avgRating: avgRating._avg.rating || 0,
    topItems,
  };
}
