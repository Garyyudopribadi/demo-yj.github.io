// Middleware to protect /user/compliance/* routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: check for a session cookie named 'user-session'
  const isLoggedIn = request.cookies.get('user-session');

  if (!isLoggedIn) {
    // Redirect to login form at /user
    return NextResponse.redirect(new URL('/user', request.url));
  }

  // Allow access if logged in
  return NextResponse.next();
}

// Apply only to /user/compliance/* routes
export const config = {
  matcher: ['/user/compliance/:path*'],
};
