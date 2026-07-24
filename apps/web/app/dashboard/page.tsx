import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ShoppingBag,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard' };

async function getDashboardData(studentId: string) {
  const [student, recentOrders, activeOrder] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      select: { name: true, rewardPoints: true, walletBalance: true },
    }),
    prisma.order.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        stall: { select: { name: true } },
        items: { take: 1, include: { menuItem: { select: { name: true } } } },
      },
    }),
    prisma.order.findFirst({
      where: {
        studentId,
        status: { in: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY'] },
      },
      include: { stall: { select: { name: true } } },
    }),
  ]);

  return { student, recentOrders, activeOrder };
}

const statusColors: Record<string, string> = {
  PLACED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  ACCEPTED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PREPARING: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  READY: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  COLLECTED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  COMPLETED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusLabels: Record<string, string> = {
  PLACED: 'Placed',
  ACCEPTED: '✅ Accepted',
  PREPARING: '👨‍🍳 Preparing',
  READY: '🔔 Ready!',
  COLLECTED: '📦 Collected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { student, recentOrders, activeOrder } = await getDashboardData(session.user.id);

  const firstName = student?.name.split(' ')[0] || 'there';

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b-4 border-foreground">
        <div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-2">
            Hey, <span className="bg-primary px-2">{firstName}</span> 👋
          </h1>
          <p className="font-bold text-lg uppercase text-foreground/80 border-l-4 border-foreground pl-3">
            What are you craving today?
          </p>
        </div>
        <Link
          href="/dashboard/stalls"
          className="hidden sm:inline-flex items-center gap-2 bg-secondary text-foreground px-6 py-3 border-4 border-foreground rounded-xl text-lg font-black uppercase hover:bg-primary transition-colors brutal-shadow-sm brutal-shadow-hover"
        >
          Browse stalls
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* ─── Active Order Banner ─── */}
      {activeOrder && (
        <div className="relative overflow-hidden rounded-2xl bg-accent border-4 border-foreground brutal-shadow p-6 text-foreground">
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/20 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-sm font-black uppercase mb-1 border-b-2 border-foreground inline-block">Active Order</div>
                <h2 className="text-4xl font-black uppercase">{activeOrder.stall.name}</h2>
                <div className="mt-4 inline-flex items-center gap-2 bg-white border-2 border-foreground rounded-xl px-4 py-2 font-black uppercase brutal-shadow-sm">
                  <Zap className="w-5 h-5" />
                  {statusLabels[activeOrder.status]}
                </div>
              </div>
              <Link
                href={`/dashboard/orders/${activeOrder.id}`}
                className="bg-foreground text-white hover:-translate-y-1 transition-transform px-6 py-3 rounded-xl font-black uppercase flex items-center gap-2 brutal-shadow-sm"
              >
                Track Order <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Wallet Balance',
            value: formatPrice(Number(student?.walletBalance ?? 0)),
            icon: '💳',
            color: 'bg-primary',
          },
          {
            label: 'Loyalty Points',
            value: `${student?.rewardPoints ?? 0} pts`,
            icon: '⭐',
            color: 'bg-secondary',
          },
          {
            label: 'Total Orders',
            value: recentOrders.length.toString(),
            icon: '🛍️',
            color: 'bg-accent',
          },
          {
            label: 'Avg. Queue Skip',
            value: '18 min',
            icon: '⚡',
            color: 'bg-white',
          },
        ].map((stat, i) => (
          <div key={stat.label} className={`border-4 border-foreground brutal-shadow rounded-2xl p-6 ${stat.color} hover:-translate-y-1 transition-transform`}>
            <div className="text-3xl mb-4 bg-white border-2 border-foreground rounded-xl w-12 h-12 flex items-center justify-center brutal-shadow-sm">{stat.icon}</div>
            <div className="text-4xl font-black uppercase text-foreground mb-1">{stat.value}</div>
            <div className="font-bold uppercase text-foreground/80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Quick Actions ─── */}
      <div>
        <h2 className="text-2xl font-black uppercase text-foreground mb-6 flex items-center gap-3">
          <span className="bg-foreground text-white px-3 py-1 rounded-lg">⚡</span> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { href: '/dashboard/stalls', emoji: '🍽️', label: 'Browse Stalls' },
            { href: '/dashboard/orders', emoji: '📦', label: 'My Orders' },
            { href: '/dashboard/favorites', emoji: '❤️', label: 'Favorites' },
            { href: '/dashboard/whatsapp', emoji: '💬', label: 'WhatsApp Bot' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-4 p-6 bg-white border-4 border-foreground rounded-2xl hover:bg-secondary hover:-translate-y-2 transition-all brutal-shadow brutal-shadow-hover group text-center"
            >
              <span className="text-5xl group-hover:scale-110 transition-transform">{action.emoji}</span>
              <span className="text-lg font-black uppercase text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Recent Orders ─── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black uppercase text-foreground flex items-center gap-3">
            <span className="bg-foreground text-white px-3 py-1 rounded-lg">🕒</span> Recent Orders
          </h2>
          <Link href="/dashboard/orders" className="text-lg font-black uppercase hover:text-primary transition-colors flex items-center gap-2 border-b-4 border-foreground pb-1 hover:border-primary">
            View all <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-white border-4 border-foreground brutal-shadow rounded-2xl p-12 text-center flex flex-col items-center">
            <div className="text-6xl mb-6 bg-accent border-4 border-foreground rounded-full w-24 h-24 flex items-center justify-center brutal-shadow-sm">🍽️</div>
            <p className="text-3xl font-black uppercase text-foreground mb-2">No orders yet</p>
            <p className="font-bold text-lg text-foreground/60 uppercase mb-8">Place your first order and skip the queue!</p>
            <Link
              href="/dashboard/stalls"
              className="inline-flex items-center gap-2 bg-primary text-foreground px-8 py-4 border-4 border-foreground rounded-xl text-xl font-black uppercase hover:bg-secondary transition-colors brutal-shadow-sm brutal-shadow-hover"
            >
              Explore stalls <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order: any) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-6 bg-white border-4 border-foreground rounded-2xl p-6 hover:bg-primary/10 transition-all brutal-shadow brutal-shadow-hover group"
              >
                <div className="w-16 h-16 border-4 border-foreground rounded-xl bg-secondary flex items-center justify-center text-3xl flex-shrink-0 brutal-shadow-sm group-hover:rotate-12 transition-transform">
                  🍜
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-2xl uppercase text-foreground truncate mb-1">{order.stall.name}</p>
                  <p className="font-bold uppercase text-foreground/70 truncate border-l-4 border-foreground pl-3">
                    {order.items[0]?.menuItem.name ?? 'View items'}
                    {order.items.length > 1 && ` +${order.items.length - 1} more`}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0 mt-4 sm:mt-0">
                  <span className={`text-sm px-4 py-1 border-2 border-foreground rounded-xl font-black uppercase brutal-shadow-sm ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <span className="font-bold text-foreground/60 uppercase text-sm bg-muted px-3 py-1 rounded-lg border-2 border-foreground">{formatRelativeTime(order.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
