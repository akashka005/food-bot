import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { TrendingUp, Users, ShoppingBag, Clock, ArrowRight } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Vendor Dashboard' };

export default async function VendorDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'VENDOR') redirect('/login');

  const vendor = await prisma.vendor.findUnique({
    where: { id: session.user.id },
    include: { foodStalls: true },
  });

  const stall = vendor?.foodStalls?.[0];

  if (!stall) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold mb-4">No Stall Assigned</h1>
        <p className="text-muted-foreground">Please contact administration to assign a stall to your account.</p>
      </div>
    );
  }

  // Get today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, pendingOrders, revenue] = await Promise.all([
    prisma.order.count({
      where: { stallId: stall.id, createdAt: { gte: today }, status: { not: 'CANCELLED' } },
    }),
    prisma.order.count({
      where: { stallId: stall.id, status: { in: ['PLACED', 'ACCEPTED', 'PREPARING'] } },
    }),
    prisma.payment.aggregate({
      where: { order: { stallId: stall.id }, status: 'PAID', createdAt: { gte: today } },
      _sum: { amount: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    where: { stallId: stall.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      student: { select: { name: true } },
      items: { include: { menuItem: { select: { name: true } } } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome back, {stall.name}
          </h1>
          <p className="text-muted-foreground mt-1">Here is what is happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3 mr-1">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stall.status === 'OPEN' ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${stall.status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="font-semibold text-sm">{stall.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="font-medium text-sm">Today's Revenue</span>
          </div>
          <div className="font-display text-3xl font-bold text-foreground">
            {formatPrice(Number(revenue._sum?.amount || 0))}
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-sm">Today's Orders</span>
          </div>
          <div className="font-display text-3xl font-bold text-foreground">{todayOrders}</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-sm">Pending in Kitchen</span>
          </div>
          <div className="font-display text-3xl font-bold text-foreground">{pendingOrders}</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-sm">Avg Wait Time</span>
          </div>
          <div className="font-display text-3xl font-bold text-foreground">14m</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-foreground">Recent Orders</h2>
            <Link href="/vendor/kitchen" className="text-sm text-orange-500 hover:underline flex items-center gap-1 font-medium">
              Go to Kitchen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
                    <span className="text-sm font-semibold">{order.student.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-1 ${
                    order.status === 'PLACED' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'PREPARING' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'READY' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    {order.status}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatRelativeTime(order.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
          <h2 className="font-display font-bold text-xl mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-3 rounded-xl font-medium text-sm text-left px-4 flex items-center justify-between">
              Update Stall Status <ArrowRight className="w-4 h-4" />
            </button>
            <Link href="/vendor/menu/add" className="block w-full bg-white/20 hover:bg-white/30 transition-colors py-3 rounded-xl font-medium text-sm text-left px-4 flex items-center justify-between">
              Add Menu Item <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-3 rounded-xl font-medium text-sm text-left px-4 flex items-center justify-between">
              Run Flash Sale <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
