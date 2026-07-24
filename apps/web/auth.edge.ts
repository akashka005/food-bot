/**
 * Edge-safe auth for Next.js Middleware.
 *
 * next-auth provides a dedicated /edge export that uses only Web APIs
 * (no Node.js native modules like node:crypto, DecompressionStream, etc.)
 * This is the correct way to use NextAuth v5 in Edge Middleware.
 */
import { NextAuth } from 'next-auth/edge';
import type { UserRole } from '@smartfood/shared';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}

export const { auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // No providers — credentials verify is done server-side, not in edge middleware.
  // Middleware only needs to read the JWT session token.
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as typeof token & { id?: string; role?: UserRole };
      if (user) {
        t.id = user.id;
        t.role = (user as typeof user & { role?: UserRole }).role;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as typeof token & { id?: string; role?: UserRole };
      if (session.user) {
        session.user.id = t.id as string;
        session.user.role = t.role as UserRole;
      }
      return session;
    },
  },
});
