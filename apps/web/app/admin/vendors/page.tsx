import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Search, Plus, Store, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Vendor Management' };

export default async function AdminVendorsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      foodStalls: {
        take: 1,
        include: { _count: { select: { orders: true, menuItems: true } } },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Vendors & Stalls</h1>
          <p className="text-muted-foreground mt-1">Manage vendor accounts and food stalls</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search vendors..."
              className="bg-card border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
            <Plus className="w-4 h-4" /> Onboard Vendor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:border-purple-500/30 transition-colors group">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <Store className="w-5 h-5 text-purple-600" />
                    {vendor.foodStalls[0]?.name || 'Unassigned Vendor'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{vendor.foodStalls[0]?.description || 'No description provided.'}</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Owner Name</p>
                  <p className="font-medium">{vendor.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Contact</p>
                  <p className="font-medium">{vendor.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-1.5 font-medium">
                    {vendor.status === 'ACTIVE' ? (
                      <><CheckCircle2 className="w-4 h-4 text-green-500" /> Active</>
                    ) : (
                      <><XCircle className="w-4 h-4 text-red-500" /> Inactive</>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Onboarded</p>
                  <p className="font-medium">{formatDate(vendor.createdAt)}</p>
                </div>
              </div>
            </div>

            {vendor.foodStalls[0] && (
              <div className="md:w-48 shrink-0 bg-secondary/50 rounded-xl p-4 flex flex-col justify-center space-y-4 border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Total Orders</p>
                  <p className="font-display text-2xl font-bold">{vendor.foodStalls[0]._count.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Menu Items</p>
                  <p className="font-display text-2xl font-bold">{vendor.foodStalls[0]._count.menuItems}</p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                    vendor.foodStalls[0].status === 'OPEN' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {vendor.foodStalls[0].status === 'OPEN' ? '🟢 OPEN' : '🔴 CLOSED'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {vendors.length === 0 && (
          <div className="col-span-full bg-card border border-border rounded-2xl p-16 text-center">
            <Store className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="font-medium text-lg mb-2">No vendors found</p>
            <p className="text-muted-foreground text-sm mb-6">Start by onboarding your first vendor.</p>
            <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
              <Plus className="w-4 h-4" /> Onboard Vendor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
