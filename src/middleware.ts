import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  const token = request.cookies.get('access_token')?.value;
  const validToken = process.env.ACCESS_TOKEN;

  console.log('Middleware - 路径:', path);
  console.log('Middleware - 方法:', method);
  console.log('Middleware - Cookie令牌:', token);
  console.log('Middleware - 环境变量令牌:', validToken);

  // 1. 允许访问公开页面
  if (path === '/login' || path === '/public' || path === '/api/auth/verify') {
    return NextResponse.next();
  }

  // 2. 允许公开访问GET类型的API
  if (path.startsWith('/api/links') && method === 'GET') {
    return NextResponse.next();
  }

  // 3. 验证其他所有请求
  if (!validToken) {
    console.error('Middleware - ACCESS_TOKEN环境变量未定义');
    return path.startsWith('/api/')
      ? NextResponse.json({ error: '服务器配置错误' }, { status: 500 })
      : NextResponse.redirect(new URL('/login', request.url));
  }

  if (token !== validToken) {
    console.log('Middleware - 令牌验证失败');
    return path.startsWith('/api/')
      ? NextResponse.json({ error: '需要身份验证' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('Middleware - 令牌验证成功');
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