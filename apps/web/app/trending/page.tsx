import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { prisma } from '@smartfood/database';

export default async function TrendingPage() {
  // Fetch top 10 items sorted by popularity score
  const trendingItems = await prisma.menuItem.findMany({
    take: 10,
    orderBy: {
      popularityScore: 'desc'
    },
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
        <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 border-2 border-foreground rounded-full brutal-shadow-sm mb-6 font-bold uppercase text-sm">
          <TrendingUp className="w-4 h-4" /> Top Rated
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
          <span className="bg-primary px-2">Trending</span> Now
        </h1>
        <p className="text-xl font-bold max-w-2xl mx-auto bg-white border-2 border-foreground p-4 brutal-shadow-sm">
          The most popular food on campus right now.
        </p>
      </section>

      {/* Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {trendingItems.map((item, i) => (
            <div 
              key={item.id}
              className="group flex flex-col md:flex-row bg-white border-4 border-foreground brutal-shadow brutal-shadow-hover rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-center bg-foreground text-white font-black text-5xl p-8 w-full md:w-24 shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-foreground">
                #{i + 1}
              </div>
              
              <div className={`relative w-full md:w-64 aspect-square md:aspect-auto border-b-4 md:border-b-0 md:border-r-4 border-foreground p-4 ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-accent'}`}>
                <div className="absolute top-4 left-4 bg-white border-2 border-foreground px-3 py-1 rounded-full text-xs font-black uppercase z-10 brutal-shadow-sm flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border border-foreground ${item.dietaryType === 'VEG' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {item.dietaryType}
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

              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-3xl uppercase leading-tight">{item.name}</h3>
                  <div className="hidden md:flex items-center gap-1 bg-white border-2 border-foreground px-3 py-1 brutal-shadow-sm rounded-lg font-black text-xl">
                    🔥 {item.popularityScore}
                  </div>
                </div>
                <p className="font-bold text-sm mb-4 text-foreground/60 uppercase">{item.stall.name}</p>
                <p className="font-medium text-sm mb-6 border-l-2 border-foreground pl-3">{item.description}</p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t-4 border-foreground border-dashed">
                  <span className="font-black text-4xl">₹{item.price.toString()}</span>
                  <button className="bg-foreground text-white px-8 py-4 rounded-xl font-black uppercase brutal-shadow-sm hover:-translate-y-1 hover:bg-primary transition-all text-xl">
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
