import { Bot, ArrowRight, Smartphone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WhatsAppBotPage() {
  const whatsappUrl = 'https://wa.me/14155238886?text=Hi';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(whatsappUrl)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      {/* ─── Header ─── */}
      <div className="border-b-4 border-foreground pb-6">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-4">
          Chat with <span className="bg-[#25D366] text-white px-2">AI Bot</span> 🤖
        </h1>
        <p className="font-bold text-xl uppercase text-foreground/80 border-l-4 border-foreground pl-4 max-w-2xl">
          Order food, skip the queue, and check live stall status directly from WhatsApp. No app needed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* ─── Mobile / Direct Link Card ─── */}
        <div className="bg-[#25D366] border-4 border-foreground brutal-shadow rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-2 transition-transform h-full">
          <div>
            <div className="bg-white border-4 border-foreground rounded-full w-20 h-20 flex items-center justify-center brutal-shadow-sm mb-6">
              <Smartphone className="w-10 h-10 text-foreground" />
            </div>
            <h2 className="text-3xl font-black uppercase text-foreground mb-4">On your phone?</h2>
            <p className="font-bold text-lg text-foreground/90 uppercase mb-8">
              Click the button below to instantly open WhatsApp and start chatting with the LPU SmartFood AI bot.
            </p>
          </div>
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-foreground px-8 py-5 border-4 border-foreground rounded-xl text-2xl font-black uppercase hover:bg-black hover:text-white transition-colors brutal-shadow-sm brutal-shadow-hover flex items-center justify-center gap-3"
          >
            Open WhatsApp <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        {/* ─── Desktop / QR Code Card ─── */}
        <div className="bg-white border-4 border-foreground brutal-shadow rounded-2xl p-8 flex flex-col justify-between hover:-translate-y-2 transition-transform h-full">
          <div>
            <div className="bg-primary border-4 border-foreground rounded-full w-20 h-20 flex items-center justify-center brutal-shadow-sm mb-6">
              <Bot className="w-10 h-10 text-foreground" />
            </div>
            <h2 className="text-3xl font-black uppercase text-foreground mb-4">Scan to connect</h2>
            <p className="font-bold text-lg text-foreground/80 uppercase mb-8">
              Open your phone's camera and scan the QR code to instantly start an order.
            </p>
          </div>
          
          <div className="flex justify-center bg-accent border-4 border-foreground brutal-shadow-sm rounded-xl p-8">
            <div className="bg-white p-4 border-4 border-foreground rounded-xl brutal-shadow-sm">
              {/* Using standard img to avoid Next.js external hostname config issues */}
              <img 
                src={qrCodeUrl} 
                alt="WhatsApp QR Code" 
                className="w-48 h-48"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
