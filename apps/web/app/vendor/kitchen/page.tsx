import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatTime, formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Kitchen Queue' };

export default async function KitchenQueuePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'VENDOR') redirect('/login');

  const vendor = await prisma.vendor.findUnique({
    where: { id: session.user.id },
    include: { foodStalls: true },
  });

  const stall = vendor?.foodStalls?.[0];

  if (!stall) redirect('/vendor');

  const activeOrders = await prisma.order.findMany({
    where: {
      stallId: stall.id,
      status: { in: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY'] },
    },
    orderBy: { createdAt: 'asc' }, // Oldest first
    include: {
      student: { select: { name: true } },
      items: { include: { menuItem: { select: { name: true } } } },
    },
  });

  const columns = [
    { id: 'PLACED', title: 'New Orders', color: 'border-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
    { id: 'PREPARING', title: 'Cooking', color: 'border-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' },
    { id: 'READY', title: 'Ready for Pickup', color: 'border-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Kitchen Queue</h1>
        <p className="text-muted-foreground mt-1">Live order management (Kanban)</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((col) => {
          const colOrders = activeOrders.filter(
            (o) => o.status === col.id || (col.id === 'PLACED' && o.status === 'ACCEPTED')
          );

          return (
            <div key={col.id} className={`flex-shrink-0 w-80 flex flex-col rounded-2xl border-t-4 ${col.color} bg-card shadow-sm border border-border`}>
              <div className={`p-4 border-b border-border font-semibold flex items-center justify-between ${col.bg}`}>
                <span>{col.title}</span>
                <span className="bg-background rounded-full px-2.5 py-0.5 text-xs border border-border">
                  {colOrders.length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin">
                {colOrders.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl">
                    No orders in this stage
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <div key={order.id} className="bg-background border border-border rounded-xl p-4 shadow-sm hover:border-orange-500/50 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-orange-500">#{order.id.slice(-6).toUpperCase()}</span>
                          <p className="font-semibold text-sm mt-0.5">{order.student.name}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium bg-secondary px-2 py-1 rounded">
                          {formatTime(order.createdAt)}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 my-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="font-bold text-muted-foreground">{item.quantity}x</span>
                            <span className="text-foreground leading-tight">{item.menuItem.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {formatRelativeTime(order.createdAt)}
                        </span>
                        
                        <button className="text-xs bg-secondary hover:bg-orange-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 group-hover:bg-orange-500 group-hover:text-white">
                          {col.id === 'PLACED' ? 'Start Cooking' : col.id === 'PREPARING' ? 'Mark Ready' : 'Complete'}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
