import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  // Allow access to login page without authentication
  if (path === '/login') {
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
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};