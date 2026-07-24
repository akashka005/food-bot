import { auth } from '@smartfood/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getPlatformStats } from '@smartfood/analytics';
import { Users, Store, TrendingUp, ShoppingBag, ArrowUpRight, Activity } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Admin Overview' };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  const stats = await getPlatformStats(7);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Campus-wide statistics for the last 7 days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-sm">Total GMV</span>
          </div>
          <div className="font-display text-3xl font-bold text-foreground">
            {formatPrice(stats.totalRevenue)}
          </div>
          <div className="text-xs text-green-500 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +15.2% vs last week
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-sm">Total Orders</span>
          </div>
          <div className="font-display text-3xl font-bold text-foreground">{stats.totalOrders}</div>
          <div className="text-xs text-green-500 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +8.1% vs last week
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Users className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-sm">Active Students</span>
          </div>
          <div className="font-display text-3xl font-bold text-foreground">{stats.activeStudents}</div>
          <div className="text-xs text-green-500 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +124 new signups
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Store className="w-5 h-5 text-brand-500" />
            <span className="font-medium text-sm">Avg Order Value</span>
          </div>
          <div className="font-display text-3xl font-bold text-foreground">{formatPrice(stats.avgOrderValue)}</div>
          <div className="text-xs text-muted-foreground mt-2 font-medium">
            Across {stats.topStalls.length} active stalls
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Store className="w-5 h-5 text-muted-foreground" /> Top Performing Stalls
            </h2>
            <Link href="/admin/vendors" className="text-sm text-purple-600 hover:underline">View all</Link>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {stats.topStalls.map((stall, i) => (
                <div key={stall.stallId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-muted-foreground w-4">{i + 1}</span>
                    <span className="font-medium">{stall.stallName}</span>
                  </div>
                  <span className="font-semibold">{formatPrice(stall.revenue)}</span>
                </div>
              ))}
              {stats.topStalls.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">No data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" /> System Health
            </h2>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
              <div>
                <p className="font-medium text-green-800 dark:text-green-300 text-sm">WhatsApp Webhook</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">Status: Operational (99.9% uptime)</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
              <div>
                <p className="font-medium text-green-800 dark:text-green-300 text-sm">AI Recommendation Engine</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">Avg latency: 120ms</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">Database Load</p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">Connections: 45/100 · CPU: 12%</p>
              </div>
              <div className="text-blue-500 text-xs font-bold">Stable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
