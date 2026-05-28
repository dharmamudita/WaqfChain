import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth session cookie/token
  const sessionToken = request.cookies.get('auth-token')?.value;

  // Protected routes that require authentication
  const authRoutes = ['/akun', '/chat'];
  const adminRoutes = ['/admin'];

  // Check if the path starts with any auth-required route
  const requiresAuth = authRoutes.some((route) => pathname.startsWith(route));
  const requiresAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  if (requiresAuth || requiresAdmin) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For admin routes, check admin role from cookie
    if (requiresAdmin) {
      const userRole = request.cookies.get('user-role')?.value;
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/akun/:path*', '/chat/:path*'],
};
