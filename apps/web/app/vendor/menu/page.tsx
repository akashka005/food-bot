import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Plus, MoreVertical, Search, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Menu Management' };

const categoryIcons: Record<string, string> = {
  VEG: '🟢',
  NON_VEG: '🔴',
  EGG: '🟡',
  VEGAN: '🌿',
};

export default async function MenuManagementPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'VENDOR') redirect('/login');

  const vendor = await prisma.vendor.findUnique({
    where: { id: session.user.id },
    include: { foodStalls: { take: 1 } },
  });

  const stall = vendor?.foodStalls[0];
  if (!stall) redirect('/vendor');

  const categories = await prisma.menuCategory.findMany({
    where: { stallId: stall.id },
    orderBy: { sortOrder: 'asc' },
    include: {
      menuItems: {
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Manage your stall's offerings and availability</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search items..."
              className="bg-card border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
          <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="bg-secondary/50 px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                {category.name}
                <span className="text-xs font-normal text-muted-foreground bg-background border border-border px-2 py-0.5 rounded-full">
                  {category.menuItems.length} items
                </span>
              </h2>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {category.menuItems.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No items in this category yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {category.menuItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl mt-1">{categoryIcons[item.dietaryType] || '🍽️'}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          {item.isSpecial && (
                            <span className="text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-1.5 py-0.5 rounded uppercase">
                              Featured
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            item.status === 'AVAILABLE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 max-w-lg line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64 shrink-0">
                      <div className="font-display font-bold text-lg">
                        {formatPrice(Number(item.price))}
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-16 text-center">
            <p className="font-medium text-lg mb-2">No menu categories found</p>
            <p className="text-muted-foreground text-sm mb-6">Create a category to start adding menu items.</p>
            <button className="inline-flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary/80">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
