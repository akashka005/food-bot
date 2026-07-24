'use client';

import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  menuItemId: string;
  stallId: string;
  name: string;
  price: number;
}

export default function AddToCartButton({ menuItemId, stallId, name, price }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setQuantity((q) => q + 1);
    // TODO: Add to Zustand cart store
  };

  const handleRemove = () => {
    setQuantity((q) => Math.max(0, q - 1));
    // TODO: Remove from Zustand cart store
  };

  if (quantity === 0) {
    return (
      <button
        id={`add-to-cart-${menuItemId}`}
        onClick={handleAdd}
        className="flex items-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all px-3 py-1.5 rounded-xl text-xs font-semibold"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        Add
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-primary rounded-xl overflow-hidden">
      <button
        onClick={handleRemove}
        className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors p-1.5"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="text-primary-foreground text-xs font-bold min-w-[16px] text-center">
        {quantity}
      </span>
      <button
        onClick={handleAdd}
        className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors p-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
