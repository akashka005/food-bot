import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Zap } from 'lucide-react';
import { prisma } from '@smartfood/database';

export default async function MenuPage() {
  const menuItems = await prisma.menuItem.findMany({
    include: {
      stall: true,
      category: true,
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-black selection:text-white pb-24">
      {/* Navbar */}
      <nav className="border-b-4 border-foreground bg-white sticky top-0 z-50 brutal-shadow-sm m-4 rounded-xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 hover:-translate-x-1 transition-transform">
          <ArrowLeft className="w-6 h-6" />
          <span className="font-black uppercase tracking-tight text-xl">Back Home</span>
        </Link>
        <div className="flex items-center gap-4">
          <Image src="/thriveor.png" alt="Thriveor" width={100} height={28} className="object-contain" />
        </div>
      </nav>

      {/* Header */}
      <section className="px-4 pt-12 pb-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-primary px-4 py-2 border-2 border-foreground rounded-full brutal-shadow-sm mb-6 font-bold uppercase text-sm">
          <Zap className="w-4 h-4" /> All Cravings
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
          The <span className="bg-secondary px-2">Menu</span>
        </h1>
        <p className="text-xl font-bold max-w-2xl mx-auto bg-white border-2 border-foreground p-4 brutal-shadow-sm">
          Browse everything cooking right now at LPU.
        </p>
      </section>

      {/* Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, i) => (
            <div 
              key={item.id}
              className="group flex flex-col bg-white border-4 border-foreground brutal-shadow brutal-shadow-hover rounded-2xl overflow-hidden"
            >
              <div className={`relative aspect-[4/3] border-b-4 border-foreground p-4 ${i % 2 === 0 ? 'bg-primary' : 'bg-accent'}`}>
                <div className="absolute top-4 left-4 bg-white border-2 border-foreground px-3 py-1 rounded-full text-xs font-black uppercase z-10 brutal-shadow-sm flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border border-foreground ${item.dietaryType === 'VEG' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {item.dietaryType}
                </div>
                
                <div className="absolute top-4 right-4 bg-white border-2 border-foreground px-3 py-1 rounded-full text-xs font-black uppercase z-10 brutal-shadow-sm">
                  {item.stall.name}
                </div>

                <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-foreground brutal-shadow-sm bg-white flex items-center justify-center">
                   {/* Fallback image if none exists in DB */}
                  <Image 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'} 
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-black text-2xl uppercase leading-tight mb-2">{item.name}</h3>
                <p className="font-medium text-sm mb-6 flex-1 text-foreground/80 border-l-2 border-foreground pl-3">{item.description}</p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t-4 border-foreground border-dashed">
                  <span className="font-black text-3xl">₹{item.price.toString()}</span>
                  <button className="bg-foreground text-white px-6 py-3 rounded-xl font-black uppercase brutal-shadow-sm hover:-translate-y-1 hover:bg-secondary hover:text-foreground border-2 border-transparent hover:border-foreground transition-all">
                    + Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
