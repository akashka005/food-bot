import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, PackageOpen } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'My Orders' };

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
  PLACED: '⏳ Placed',
  ACCEPTED: '✅ Accepted',
  PREPARING: '👨‍🍳 Preparing',
  READY: '🔔 Ready for pickup!',
  COLLECTED: '📦 Collected',
  COMPLETED: '✓ Completed',
  CANCELLED: '✕ Cancelled',
  REJECTED: '✕ Rejected',
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const orders = await prisma.order.findMany({
    where: { studentId: session.user.id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      stall: { select: { name: true } },
      items: {
        include: { menuItem: { select: { name: true, price: true } } },
        take: 2,
      },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-1">{orders.length} orders placed</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <PackageOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <p className="font-semibold text-foreground text-lg">No orders yet</p>
          <p className="text-muted-foreground text-sm mt-1 mb-6">
            Browse stalls and place your first order!
          </p>
          <Link
            href="/dashboard/stalls"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Browse Stalls <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400/20 to-brand-600/10 flex items-center justify-center text-2xl flex-shrink-0">
                🍜
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{order.stall.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {order.items.map((i) => i.menuItem.name).join(', ')}
                  {order._count.items > 2 && ` +${order._count.items - 2} more`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(order.createdAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="font-display font-bold text-foreground">
                  {formatPrice(Number(order.totalAmount))}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
