import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/verify - Check if user is authenticated via cookie
export async function GET(request: NextRequest) {
  try {
    // Check for the token in the cookies
    const token = request.cookies.get('access_token')?.value;
    const validToken = process.env.ACCESS_TOKEN;
    
    if (!validToken) {
      console.error('ACCESS_TOKEN is not defined in environment variables');
      return NextResponse.json(
        { error: '服务器配置错误：缺少访问令牌' },
        { status: 500 }
      );
    }
    
    // Check if the token is valid
    if (token !== validToken) {
      console.log('验证失败：令牌无效或不存在');
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    // User is authenticated
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('验证过程中发生错误:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
}

// POST /api/auth/verify - Verify the token and set a cookie
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { token } = data;
    
    const validToken = process.env.ACCESS_TOKEN;
    
    console.log('用户提供的令牌:', token);
    console.log('服务器设置的令牌:', validToken);
    
    if (!validToken) {
      console.error('ACCESS_TOKEN is not defined in environment variables');
      return NextResponse.json(
        { error: '服务器配置错误：缺少访问令牌' },
        { status: 500 }
      );
    }
    
    // Check if the token is valid
    if (token !== validToken) {
      console.log('令牌不匹配，验证失败');
      return NextResponse.json(
        { error: '无效的访问令牌' },
        { status: 401 }
      );
    }
    
    console.log('令牌验证成功');
    
    // Create a response
    const response = NextResponse.json({ success: true });
    
    // Set a cookie with the token
    // maxAge is set to 30 days in seconds: 30 * 24 * 60 * 60
    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('验证过程中发生错误:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
}