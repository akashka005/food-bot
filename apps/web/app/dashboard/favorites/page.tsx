import { auth } from '@smartfood/auth';
import { prisma } from '@smartfood/database';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Heart, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/menu/add-to-cart-button';

export const metadata: Metadata = { title: 'Favorites' };

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const student = await prisma.student.findUnique({
    where: { id: session.user.id },
    include: {
      favoriteFoods: {
        include: {
          menuItem: { include: { stall: true } },
        },
      },
    },
  });

  const favorites = student?.favoriteFoods || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Favorites</h1>
        <p className="text-muted-foreground mt-1">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <p className="font-semibold text-foreground text-lg">No favorites yet</p>
          <p className="text-muted-foreground text-sm mt-1 mb-6">
            Tap the heart icon on any menu item to save it here for quick ordering.
          </p>
          <Link
            href="/dashboard/stalls"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Browse Menu <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map(({ menuItem: item }: { menuItem: any }) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex-shrink-0 text-3xl">
                {item.dietaryType === 'VEG' ? '🟢' : item.dietaryType === 'NON_VEG' ? '🔴' : '🟡'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm truncate">{item.name}</h3>
                  <Heart className="w-4 h-4 fill-primary text-primary flex-shrink-0 cursor-pointer" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {item.stall.name}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-display font-bold text-foreground text-sm">
                    {formatPrice(Number(item.price))}
                  </span>
                  <AddToCartButton
                    menuItemId={item.id}
                    stallId={item.stallId}
                    name={item.name}
                    price={Number(item.price)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
