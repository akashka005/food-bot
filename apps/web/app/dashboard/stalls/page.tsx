import { prisma } from '@smartfood/database';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Star, ChevronRight, Utensils, Store } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Browse Stalls' };

async function getStalls() {
  return prisma.foodStall.findMany({
    where: { status: 'OPEN', deletedAt: null },
    include: {
      _count: { select: { menuItems: true } },
      queueStatuses: { orderBy: { recordedAt: 'desc' }, take: 1 },
    },
    orderBy: { rating: 'desc' },
  });
}

const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-muted'];

export default async function StallsPage() {
  const stalls = await getStalls();

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header Section */}
      <section className="bg-white border-4 border-foreground p-8 rounded-2xl brutal-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 border-2 border-foreground rounded-full brutal-shadow-sm mb-4 font-bold uppercase text-sm">
              <Store className="w-4 h-4" /> Live Campus Kitchens
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
              Browse <span className="bg-primary px-2 text-white">Stalls</span>
            </h1>
            <p className="text-xl font-bold mt-4 border-l-4 border-foreground pl-4">
              {stalls.length} stalls currently blazing in the kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {['All', 'North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Beverages', 'Snacks'].map((cat, i) => (
          <button
            key={cat}
            className={`px-6 py-3 border-4 border-foreground rounded-full font-black uppercase whitespace-nowrap brutal-shadow brutal-shadow-hover transition-transform ${
              i === 0 ? 'bg-foreground text-white hover:bg-foreground/90' : 'bg-white hover:-translate-y-1 hover:bg-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stall Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stalls.map((stall: any, i: number) => {
          const queueLength = stall.queueStatuses[0]?.queueLength ?? 0;
          const waitMins = stall.queueStatuses[0]?.avgWaitMinutes ?? 0;
          const isBusy = queueLength > 5;
          const colorClass = colors[i % colors.length];

          return (
            <Link
              key={stall.id}
              href={`/dashboard/stalls/${stall.id}`}
              className="group flex flex-col bg-white border-4 border-foreground rounded-2xl overflow-hidden brutal-shadow brutal-shadow-hover transition-all"
            >
              {/* Image Header */}
              <div className={`relative h-48 border-b-4 border-foreground p-4 flex flex-col justify-between ${colorClass}`}>
                <div className="flex justify-between items-start">
                  <div className="bg-white border-2 border-foreground px-3 py-1 rounded-full text-xs font-black uppercase brutal-shadow-sm">
                    {stall.category.replace('_', ' ')}
                  </div>
                  <div className="bg-white border-2 border-foreground px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-2 brutal-shadow-sm">
                    <span className={`w-3 h-3 rounded-full border border-foreground ${isBusy ? 'bg-orange-500' : 'bg-green-500'}`} />
                    {isBusy ? `${waitMins} min wait` : 'Short wait'}
                  </div>
                </div>
                
                {/* Fallback pattern or Image */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                  <Utensils className="w-32 h-32" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-black text-2xl uppercase leading-tight mb-2 truncate">{stall.name}</h3>
                <p className="font-bold text-sm mb-6 text-foreground/60 uppercase truncate">{stall.location}</p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t-4 border-foreground border-dashed">
                  <div className="flex gap-4">
                    {stall.rating > 0 && (
                      <span className="font-black flex items-center gap-1 bg-primary text-white border-2 border-foreground px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 fill-current" /> {Number(stall.rating).toFixed(1)}
                      </span>
                    )}
                    <span className="font-bold uppercase text-sm flex items-center gap-1">
                      <Utensils className="w-4 h-4" /> {stall._count.menuItems}
                    </span>
                  </div>
                  <div className="bg-foreground text-white p-2 rounded-full group-hover:bg-primary transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
