'use server';

import { getLinks } from '@/lib/data';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
    // 从 cookie 中获取令牌
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token || !(await isAuthenticated(token))) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    try {
        const links = await getLinks();

        // 生成下载文件名
        const date = new Date().toISOString().split('T')[0];
        const filename = `links-export-${date}.json`;

        // 创建包含所有链接的数据对象
        const exportData = {
            links: links,
            exportDate: new Date().toISOString()
        };

        // 设置响应头以触发下载
        return new Response(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Expose-Headers': 'Content-Disposition'
            },
        });
    } catch (error) {
        console.error('Error exporting data:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to export data' }), {
            status: 500,
        });
    }
}