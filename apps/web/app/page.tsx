'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, User, ArrowRight, Star, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const products = [
  {
    name: 'BH Chicken Mandi',
    desc: 'Juicy and authentic Chicken Mandi from Biryani House.',
    price: '₹259.00',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
    tags: ['Bestseller', 'Non-Veg'],
    color: 'bg-primary'
  },
  {
    name: 'Tealogy Special Chai',
    desc: 'Signature special tea (200ml) perfectly brewed for your breaks.',
    price: '₹45.00',
    image: 'https://images.unsplash.com/photo-1461023058943-0708e5f23a54?q=80&w=600&auto=format&fit=crop',
    tags: ['Refresh', 'Veg'],
    color: 'bg-secondary'
  },
  {
    name: 'Double Cheese Margherita',
    desc: 'Loaded double cheese margherita pizza from Basant Icecream.',
    price: '₹140.00',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop',
    tags: ['Cheesy', 'Veg'],
    color: 'bg-accent'
  },
  {
    name: 'Tandoori Paneer Tikka',
    desc: 'Spicy tandoori paneer tikka with plain naan from The Tandoori Hub.',
    price: '₹90.00',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe01f72810c?q=80&w=600&auto=format&fit=crop',
    tags: ['Spicy', 'Veg'],
    color: 'bg-primary'
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-black selection:text-white pb-24">
      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="border-b-4 border-foreground bg-white sticky top-0 z-50 brutal-shadow-sm m-4 rounded-xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Image src="/thriveor.png" alt="Thriveor" width={120} height={32} className="object-contain" />
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-black uppercase tracking-tight">
          <Link href="/menu" className="hover:text-primary hover:-translate-y-1 transition-transform">Menu</Link>
          <Link href="/stalls" className="hover:text-secondary hover:-translate-y-1 transition-transform">Stalls</Link>
          <Link href="/trending" className="hover:text-accent hover:-translate-y-1 transition-transform">Trending</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="w-10 h-10 border-2 border-foreground rounded-full flex items-center justify-center hover:bg-primary transition-colors brutal-shadow-sm brutal-shadow-hover bg-white">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/register" className="px-5 py-2 bg-secondary border-2 border-foreground rounded-full font-black uppercase text-sm brutal-shadow-sm brutal-shadow-hover hover:bg-primary transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="px-4 pt-12 pb-24 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-accent px-4 py-2 border-2 border-foreground rounded-full brutal-shadow-sm mb-8 font-bold uppercase text-sm"
            >
              <Zap className="w-4 h-4" /> Live on Campus!
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6"
            >
              Eat <span className="text-primary brutal-shadow-sm inline-block rotate-2 bg-white px-2">Fast.</span><br/>
              Don't Wait.
            </motion.h1>
            
            <p className="text-xl font-bold max-w-md mb-10 border-l-4 border-foreground pl-4 bg-white/50 py-2">
              The AI-powered food ordering platform for LPU students. Pre-book via WhatsApp, beat the lunch rush.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-foreground border-4 border-foreground px-8 py-4 rounded-xl font-black text-xl brutal-shadow brutal-shadow-hover uppercase flex items-center justify-center gap-2 hover:bg-accent transition-colors">
                Order Now <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-secondary rounded-3xl brutal-shadow transform translate-x-4 translate-y-4"></div>
            <div className="relative rounded-3xl overflow-hidden border-4 border-foreground brutal-shadow aspect-square bg-white">
              <Image 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
                alt="Delicious Food"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary text-white font-black uppercase px-4 py-2 border-2 border-foreground rotate-12 brutal-shadow-sm text-xl">
                100% Tastier
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── Bestsellers Section ─────────────────────────────────────────────── */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 border-b-4 border-foreground pb-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter">
            Hot <span className="bg-secondary px-2">Drops</span>
          </h2>
          <Link href="/menu" className="font-bold uppercase flex items-center gap-2 hover:text-primary transition-colors brutal-shadow-hover bg-white border-2 border-foreground px-4 py-2 rounded-full brutal-shadow-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div 
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col bg-white border-4 border-foreground brutal-shadow brutal-shadow-hover rounded-2xl overflow-hidden"
            >
              {/* Image Header */}
              <div className={`relative aspect-square border-b-4 border-foreground p-4 ${product.color}`}>
                <div className="absolute top-4 left-4 bg-white border-2 border-foreground px-3 py-1 rounded-full text-xs font-black uppercase z-10 brutal-shadow-sm">
                  {product.tags[0]}
                </div>
                
                <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-foreground brutal-shadow-sm bg-white">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-black text-xl uppercase leading-tight mb-2">{product.name}</h3>
                <p className="font-medium text-sm mb-6 flex-1 line-clamp-2">{product.desc}</p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-foreground border-dashed">
                  <span className="font-black text-2xl">{product.price}</span>
                  <button className="bg-foreground text-white px-4 py-2 rounded-lg font-black uppercase text-sm brutal-shadow-sm hover:-translate-y-1 hover:bg-primary transition-all">
                    Add +
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
