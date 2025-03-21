'use server';

import { NextRequest, NextResponse } from 'next/server';
import { toggleLinkStar } from '@/lib/star';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing link id' }, { status: 400 });
        }

        // 检查用户是否已认证
        const token = request.cookies.get('access_token')?.value;
        const userIsAuthenticated = await isAuthenticated(token);

        if (!userIsAuthenticated) {
            return NextResponse.json(
                { error: '未授权操作' },
                { status: 401 }
            );
        }

        const updatedLink = await toggleLinkStar(id);

        if (!updatedLink) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json(updatedLink);
    } catch (error) {
        console.error('Error toggling star:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}