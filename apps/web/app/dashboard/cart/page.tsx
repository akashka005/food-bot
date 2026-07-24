'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Clock, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useSession } from 'next-auth/react';

// Mock cart data for UI layout
const mockCart = {
  stallId: 'stall_1',
  stallName: 'Spice Route',
  items: [
    { id: '1', menuItemId: 'menu_1', name: 'Paneer Butter Masala', price: 18000, quantity: 1, dietaryType: 'VEG' },
    { id: '2', menuItemId: 'menu_2', name: 'Garlic Naan', price: 4000, quantity: 2, dietaryType: 'VEG' },
  ],
};

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [items, setItems] = useState(mockCart.items);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + taxes;

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPlacing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-card border border-border rounded-3xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Your order has been sent to the vendor. We'll notify you when it's ready for pickup.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard/orders"
            className="block w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Track Order
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-secondary text-foreground font-medium py-3.5 rounded-xl hover:bg-secondary/80 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Your Cart</h1>
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <p className="font-semibold text-foreground text-lg">Your cart is empty</p>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Looks like you haven't added anything yet.</p>
          <Link
            href="/dashboard/stalls"
            className="inline-flex items-center bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Browse Food Stalls
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-secondary rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Order from {mockCart.stallName}</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">
                      {item.dietaryType === 'VEG' ? '🟢' : item.dietaryType === 'NON_VEG' ? '🔴' : '🟡'}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-sm font-semibold text-muted-foreground mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-secondary rounded-lg px-2 py-1">
                      <button
                        onClick={() => {
                          const newItems = items.map(i => i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i).filter(i => i.quantity > 0);
                          setItems(newItems);
                        }}
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground font-medium text-lg"
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))}
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground font-medium text-lg"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-foreground text-sm w-16 text-right">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link
              href={`/dashboard/stalls/${mockCart.stallId}`}
              className="inline-block mt-4 text-sm text-primary font-medium hover:underline"
            >
              + Add more items
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Pickup Time</h2>
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm text-foreground">ASAP (Approx 15-20 mins)</p>
                  <p className="text-xs text-muted-foreground">Skip the queue</p>
                </div>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">Change</button>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold text-foreground mb-4">Bill Details</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Item Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxes & Fees</span>
                <span>{formatPrice(taxes)}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-foreground text-lg pt-3 border-t border-border">
                <span>To Pay</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="w-full bg-gradient-brand text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all glow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPlacing ? (
                'Processing...'
              ) : (
                <>Place Order <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Payment will be deducted from your campus wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
