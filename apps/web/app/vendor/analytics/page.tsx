import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getVendorStats } from '@smartfood/analytics';

export const metadata: Metadata = { title: 'Analytics & Sales' };

export default async function VendorAnalyticsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'VENDOR') redirect('/login');

  const vendor = await prisma.vendor.findUnique({
    where: { id: session.user.id },
    include: { foodStalls: { take: 1 } },
  });

  const stall = vendor?.foodStalls[0];
  if (!stall) redirect('/vendor');

  // Fetch 7-day stats
  const stats = await getVendorStats(stall.id, 7);
  
  // Resolve item names
  const itemIds = stats.topItems.map(i => i.menuItemId);
  const items = await prisma.menuItem.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, name: true, price: true },
  });
  const itemMap = new Map(items.map(i => [i.id, i]));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics & Sales</h1>
        <p className="text-muted-foreground mt-1">Performance overview for the last 7 days</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-dark border border-white/10 rounded-2xl p-6 relative overflow-hidden text-white glow-sm">
          <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/70 font-medium text-sm">Total Revenue</span>
              <div className="bg-white/10 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold mb-1">{formatPrice(stats.totalRevenue)}</div>
              <div className="flex items-center gap-1 text-sm text-green-400 font-medium">
                <TrendingUp className="w-4 h-4" /> +12.5% from last week
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground font-medium text-sm">Total Orders</span>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div>
            <div className="font-display text-4xl font-bold text-foreground mb-1">{stats.totalOrders}</div>
            <div className="flex items-center gap-1 text-sm text-green-500 font-medium">
              <TrendingUp className="w-4 h-4" /> +5.2% from last week
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground font-medium text-sm">Average Rating</span>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
              <span className="text-xl">⭐</span>
            </div>
          </div>
          <div>
            <div className="font-display text-4xl font-bold text-foreground mb-1">{stats.avgRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
              Based on recent reviews
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold text-lg text-foreground">Top Selling Items</h2>
          </div>
          <div className="divide-y divide-border">
            {stats.topItems.map((item, i) => {
              const details = itemMap.get(item.menuItemId);
              return (
                <div key={item.menuItemId} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-display font-bold text-lg text-muted-foreground w-6 text-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-foreground">{details?.name || 'Unknown Item'}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(Number(details?.price || 0))}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{item._count.menuItemId} ordered</p>
                    <p className="text-xs text-green-500 mt-0.5">
                      {formatPrice(Number(details?.price || 0) * item._count.menuItemId)}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {stats.topItems.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No sales data available for this period.
              </div>
            )}
          </div>
        </div>

        {/* Predictive insights (Mocked UI) */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h2 className="font-semibold text-lg text-foreground">AI Insights</h2>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex gap-3">
              <TrendingUp className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-blue-800 dark:text-blue-300">Demand Forecast</h3>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                  Expected 20% increase in orders tomorrow due to mid-term exams ending. Prepare extra stock for "Paneer Wrap".
                </p>
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl p-4 flex gap-3">
              <Users className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-orange-800 dark:text-orange-300">Queue Optimization</h3>
                <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">
                  Your average wait time was 18 mins during peak hours today. Consider batch-preparing popular items between 1 PM - 2 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
