'use server';

import { Link, LinksData, saveLinks } from '@/lib/data';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';

// 验证导入的数据格式
// 导入数据的预期结构
interface ImportData {
    links: Array<{
        title: string;
        url: string;
        description?: string;
        categories: string[];
    }>;
}

function validateImportData(data: unknown): data is LinksData {
    const importData = data as ImportData;

    if (!importData || !Array.isArray(importData.links)) {
        return false;
    }

    return importData.links.every((link) => {
        return (
            typeof link.title === 'string' &&
            typeof link.url === 'string' &&
            (link.description === undefined || typeof link.description === 'string') &&
            Array.isArray(link.categories) &&
            link.categories.every((category) => typeof category === 'string')
        );
    });
}

export async function POST(request: Request) {
    // 验证认证状态
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token || !(await isAuthenticated(token))) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    try {
        const data = await request.json();

        // 验证数据格式
        if (!validateImportData(data)) {
            return new NextResponse(
                JSON.stringify({ error: 'Invalid data format' }),
                { status: 400 }
            );
        }

        // 为每个导入的链接生成新的 ID
        const importedLinks = data.links.map((link: Omit<Link, 'id'>, index: number) => ({
            ...link,
            id: (index + 1).toString() // 简单的 ID 生成策略
        }));

        // 保存导入的数据
        await saveLinks(importedLinks);

        return new NextResponse(
            JSON.stringify({
                message: 'Data imported successfully',
                count: importedLinks.length
            })
        );
    } catch (error) {
        console.error('Error importing data:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to import data' }),
            { status: 500 }
        );
    }
}