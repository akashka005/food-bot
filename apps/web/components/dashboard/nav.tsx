'use client';

import Link from 'next/link';
import { Bell, Search, ShoppingCart } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface NavProps {
  user: { id: string; name: string; email: string };
}

export default function DashboardNav({ user }: NavProps) {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-6 gap-4">
      {/* Search bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search menu, stalls..."
            className="w-full bg-secondary border border-border rounded-xl py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Cart */}
        <Link
          href="/dashboard/cart"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <ShoppingCart className="w-5 h-5" />
          {/* Cart count badge - will be dynamic */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
            0
          </span>
        </Link>

        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-5 h-5" />
        </Link>

        {/* Avatar */}
        <Link href="/dashboard/profile" className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user.name)}
          </div>
        </Link>
      </div>
    </header>
  );
}
