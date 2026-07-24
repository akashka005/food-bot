import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/', '/menu', '/stalls', '/trending'];
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const apiAuthPrefix = '/api/auth';

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  
  // Use NextAuth's built-in getToken to decrypt the JWE at the edge
  // We need to pass the secret explicitly to getToken
  const session = await getToken({ 
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
    salt: process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token',
  });
  
  const isLoggedIn = !!session;
  const userRole = session?.role as string | undefined;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isWebhookRoute = nextUrl.pathname.startsWith('/api/webhooks');
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // 1. Allow API Auth routes and Webhooks
  if (isApiAuthRoute || isWebhookRoute) {
    return NextResponse.next();
  }

  // 2. Redirect logged-in users away from auth pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (userRole === 'STUDENT') return NextResponse.redirect(new URL('/dashboard', nextUrl));
      if (userRole === 'VENDOR') return NextResponse.redirect(new URL('/vendor', nextUrl));
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')
        return NextResponse.redirect(new URL('/admin', nextUrl));
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Protect non-public routes
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl));
  }

  // 4. Role-based routing guard
  if (isLoggedIn) {
    if (
      nextUrl.pathname.startsWith('/admin') &&
      userRole !== 'ADMIN' &&
      userRole !== 'SUPER_ADMIN'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl));
    }

    if (
      nextUrl.pathname.startsWith('/vendor') &&
      userRole !== 'VENDOR' &&
      userRole !== 'ADMIN' &&
      userRole !== 'SUPER_ADMIN'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl));
    }

    if (nextUrl.pathname.startsWith('/dashboard') && userRole !== 'STUDENT') {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
