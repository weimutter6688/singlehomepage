import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  const method = request.method;
  
  // Check if this is an API link route that needs protection
  if (path.startsWith('/api/links')) {
    // Allow GET requests without authentication (public access for viewing)
    if (method === 'GET') {
      return NextResponse.next();
    }
    
    // For POST, PUT, DELETE requests, require authentication
    const token = request.cookies.get('access_token')?.value;
    const validToken = process.env.ACCESS_TOKEN;
    
    if (token !== validToken) {
      return NextResponse.json(
        { error: '需要身份验证才能执行此操作' },
        { status: 401 }
      );
    }
    
    return NextResponse.next();
  }
  
  // For non-API routes:
  
  // Allow access to public pages without authentication
  if (path === '/login' || path === '/public' || path === '/') {
    return NextResponse.next();
  }
  
  // Check for the token in the cookies
  const token = request.cookies.get('access_token')?.value;
  const validToken = process.env.ACCESS_TOKEN;
  
  // If token doesn't match, redirect to login page
  if (token !== validToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Continue to the requested page
  return NextResponse.next();
}

// Configure which paths the middleware applies to
// Now include api/links routes to enforce selective protection
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/links/:path*'
  ],
};