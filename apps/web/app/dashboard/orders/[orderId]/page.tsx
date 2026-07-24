import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ChevronLeft, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Order Details' };

interface Props {
  params: Promise<{ orderId: string }>;
}

const statusSteps = [
  { key: 'PLACED', label: 'Order Placed', icon: '📤' },
  { key: 'ACCEPTED', label: 'Accepted', icon: '✅' },
  { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'READY', label: 'Ready for Pickup', icon: '🔔' },
  { key: 'COLLECTED', label: 'Picked Up', icon: '🎉' },
];

const statusOrder = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COLLECTED'];

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');

  const order = await prisma.order.findUnique({
    where: { id: orderId, studentId: session.user.id },
    include: {
      stall: true,
      items: { include: { menuItem: { select: { name: true, price: true, dietaryType: true } } } },
      payment: true,
      pickupSlot: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!order) notFound();

  const currentStepIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        All Orders
      </Link>

      {/* Order header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{order.stall.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
          {order.stall.location && (
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {order.stall.location}
            </span>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      {!isCancelled ? (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-6">Order Status</h2>
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const isDone = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const historyEntry = order.statusHistory.find((h: any) => h.status === step.key);

              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                        isDone
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}
                    >
                      {isDone ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{index + 1}</span>}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-6 mt-1 ${isDone && index < currentStepIndex ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className={`text-sm font-medium ${isDone ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.icon} {step.label}
                    </p>
                    {historyEntry && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTime(historyEntry.createdAt)}
                        {historyEntry.notes && ` · ${historyEntry.notes}`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl p-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-700 dark:text-red-300">Order Cancelled</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              This order was cancelled. A refund will be processed if payment was made.
            </p>
          </div>
        </div>
      )}

      {/* Pickup slot */}
      {order.pickupSlot && (
        <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40 rounded-2xl p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
              Pickup slot: {order.pickupSlot.startTime} – {order.pickupSlot.endTime}
            </p>
            <p className="text-xs text-brand-600/70 dark:text-brand-400/70">Head to the stall around this time</p>
          </div>
        </div>
      )}

      {/* Order items */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold text-foreground mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {item.menuItem.dietaryType === 'VEG' ? '🟢' : item.menuItem.dietaryType === 'NON_VEG' ? '🔴' : '🟡'}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.menuItem.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">{formatPrice(Number(item.totalPrice))}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-sm text-green-500">
              <span>Discount</span>
              <span>-{formatPrice(Number(order.discountAmount))}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxes</span>
            <span>{formatPrice(Number(order.taxAmount))}</span>
          </div>
          <div className="flex justify-between font-display font-bold text-foreground pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(Number(order.totalAmount))}</span>
          </div>
        </div>
      </div>

      {/* Payment info */}
      {order.payment && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-3">Payment</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Method</p>
              <p className="font-medium text-foreground mt-0.5">{order.payment.method}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className={`font-medium mt-0.5 ${order.payment.status === 'PAID' ? 'text-green-500' : 'text-foreground'}`}>
                {order.payment.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
