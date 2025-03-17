import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - Clear the authentication cookie
export async function POST(request: NextRequest) {
  try {
    // Create a response
    const response = NextResponse.json({ success: true });
    
    // Clear the access_token cookie
    response.cookies.delete('access_token');
    
    return response;
  } catch (error) {
    console.error('登出过程中发生错误:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
}