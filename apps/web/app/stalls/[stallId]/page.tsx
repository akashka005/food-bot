import { prisma } from '@smartfood/database';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Store, Clock, Star, Flame, Plus } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Stall Menu' };

export default async function PublicStallDetailPage({ params }: { params: Promise<{ stallId: string }> }) {
  const { stallId } = await params;
  const stall = await prisma.foodStall.findUnique({
    where: { id: stallId },
    include: {
      menuItems: {
        where: { status: 'AVAILABLE', deletedAt: null },
      },
    }
  });

  if (!stall) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      
      {/* Navigation */}
      <Link href="/stalls" className="inline-flex items-center gap-2 font-black uppercase hover:text-primary transition-colors border-2 border-foreground bg-white px-4 py-2 rounded-xl brutal-shadow-sm brutal-shadow-hover">
        <ArrowLeft className="w-5 h-5" /> Back to Stalls
      </Link>

      {/* Header Section */}
      <section className="bg-primary text-foreground border-4 border-foreground p-8 rounded-2xl brutal-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 border-2 border-foreground rounded-full brutal-shadow-sm mb-6 font-bold uppercase text-sm">
            <Store className="w-4 h-4" /> {stall.category.replace('_', ' ')}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            {stall.name}
          </h1>
          
          <p className="text-xl font-bold max-w-2xl bg-white p-4 border-2 border-foreground brutal-shadow-sm">
            {stall.description || `The best ${stall.category.replace('_', ' ')} on campus. Located in ${stall.location}.`}
          </p>

          <div className="flex gap-4 mt-8">
            <span className="font-black flex items-center gap-2 bg-accent border-2 border-foreground px-4 py-2 rounded-xl brutal-shadow-sm uppercase">
              <Star className="w-5 h-5 fill-current" /> {stall.rating > 0 ? Number(stall.rating).toFixed(1) : 'New'}
            </span>
            <span className="font-black flex items-center gap-2 bg-secondary border-2 border-foreground px-4 py-2 rounded-xl brutal-shadow-sm uppercase">
              <Clock className="w-5 h-5" /> {stall.openingTime} - {stall.closingTime}
            </span>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Full Menu</h2>
          <div className="flex-1 border-b-4 border-foreground border-dashed"></div>
          <Flame className="w-8 h-8 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stall.menuItems.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-white border-4 border-foreground rounded-2xl brutal-shadow border-dashed">
              <p className="font-black text-2xl uppercase">Menu items are cooking...</p>
            </div>
          ) : (
            stall.menuItems.map((item, i) => (
              <div key={item.id} className="group bg-white border-4 border-foreground rounded-2xl p-5 brutal-shadow brutal-shadow-hover flex flex-col transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-black uppercase px-2 py-1 border-2 border-foreground rounded-full brutal-shadow-sm ${item.dietaryType === 'VEG' ? 'bg-green-400' : item.dietaryType === 'NON_VEG' ? 'bg-red-400' : 'bg-yellow-400'}`}>
                    {item.dietaryType}
                  </span>
                  <span className="font-black text-2xl">
                    ₹{Number(item.price)}
                  </span>
                </div>
                
                <h3 className="font-black text-xl uppercase mb-2 leading-tight">{item.name}</h3>
                <p className="font-bold text-sm text-foreground/70 mb-6 flex-1">
                  {item.description || 'Deliciously prepared to perfection.'}
                </p>

                <Link href="/login" className="w-full bg-foreground text-white font-black uppercase py-3 rounded-xl border-2 border-foreground flex items-center justify-center gap-2 hover:bg-primary brutal-shadow-sm transition-colors">
                  <Plus className="w-5 h-5" /> Order Now
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
