import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Wallet as WalletIcon, CreditCard, ArrowUpRight, ArrowDownRight, Plus, History } from 'lucide-react';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Wallet & Payments' };

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const [student, payments] = await Promise.all([
    prisma.student.findUnique({
      where: { id: session.user.id },
      select: { walletBalance: true },
    }),
    prisma.payment.findMany({
      where: { order: { studentId: session.user.id } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { order: { select: { stall: { select: { name: true } } } } },
    }),
  ]);

  const balance = Number(student?.walletBalance || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Campus Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your balance and view transactions</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-dark rounded-3xl p-8 text-white relative overflow-hidden border border-white/10 glow-primary shadow-xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <WalletIcon className="w-5 h-5" />
              <span className="font-medium">Current Balance</span>
            </div>
            <div className="font-display text-5xl font-black">
              {formatPrice(balance)}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-400 transition-colors">
              <Plus className="w-4 h-4" /> Add Money
            </button>
            <button className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors">
              <CreditCard className="w-4 h-4" /> Manage Cards
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Spent this month</p>
          <p className="font-display text-xl font-bold text-foreground">{formatPrice(1245000)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Orders placed</p>
          <p className="font-display text-xl font-bold text-foreground">18</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 col-span-2 md:col-span-1">
          <p className="text-sm text-muted-foreground mb-1">Cashback earned</p>
          <p className="font-display text-xl font-bold text-green-500">{formatPrice(45000)}</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" /> Recent Transactions
          </h2>
        </div>
        
        {payments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No transactions found
          </div>
        ) : (
          <div className="divide-y divide-border">
            {payments.map((payment) => (
              <div key={payment.id} className="p-5 flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${payment.status === 'PAID' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-muted text-muted-foreground'}`}>
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Paid to {payment.order?.stall.name || 'Vendor'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(payment.createdAt)} at {formatTime(payment.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground text-sm">-{formatPrice(Number(payment.amount))}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{payment.method}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
