import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Store } from 'lucide-react';
import { prisma } from '@smartfood/database';

export default async function StallsPage() {
  const stalls = await prisma.foodStall.findMany({
    include: {
      menuItems: true,
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
        <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 border-2 border-foreground rounded-full brutal-shadow-sm mb-6 font-bold uppercase text-sm">
          <Store className="w-4 h-4" /> Live Kitchens
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
          Food <span className="bg-primary px-2">Stalls</span>
        </h1>
        <p className="text-xl font-bold max-w-2xl mx-auto bg-white border-2 border-foreground p-4 brutal-shadow-sm">
          Explore the best spots on campus.
        </p>
      </section>

      {/* Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {stalls.map((stall, i) => (
            <Link 
              href={`/stalls/${stall.id}`}
              key={stall.id}
              className="group flex flex-col md:flex-row bg-white border-4 border-foreground brutal-shadow brutal-shadow-hover rounded-2xl overflow-hidden"
            >
              <div className={`relative w-full md:w-1/3 aspect-square md:aspect-auto border-b-4 md:border-b-0 md:border-r-4 border-foreground p-4 ${i % 2 === 0 ? 'bg-accent' : 'bg-secondary'}`}>
                <div className="absolute top-4 left-4 bg-white border-2 border-foreground px-3 py-1 rounded-full text-xs font-black uppercase z-10 brutal-shadow-sm flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border border-foreground ${stall.status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {stall.status}
                </div>
                
                <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-foreground brutal-shadow-sm bg-white flex items-center justify-center">
                   {/* Fallback image if none exists in DB */}
                  <Image 
                    src={stall.images[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop'} 
                    alt={stall.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-black text-3xl uppercase leading-tight mb-2">{stall.name}</h3>
                <p className="font-bold text-sm mb-4 text-foreground/60 uppercase">{stall.location}</p>
                <p className="font-medium text-sm mb-6 border-l-2 border-foreground pl-3">{stall.description}</p>
                
                <div className="mt-auto flex items-center gap-4 pt-4 border-t-4 border-foreground border-dashed">
                  <span className="font-black text-xl bg-primary border-2 border-foreground px-3 py-1 brutal-shadow-sm rounded-lg">
                    ★ {stall.rating}
                  </span>
                  <span className="font-bold uppercase text-sm">
                    {stall.menuItems.length} Items
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
