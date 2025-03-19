'use server';

import { Link } from './data';
import { getLinks, saveLinks } from './data';

// 切换链接的星标状态
export async function toggleLinkStar(id: string): Promise<Link | null> {
    const links = await getLinks();
    const index = links.findIndex(link => link.id === id);

    if (index === -1) return null;

    const link = links[index];
    const now = Date.now();

    // 更新星标状态
    links[index] = {
        ...link,
        starred: !link.starred,
        starredAt: !link.starred ? now : undefined
    };

    // 重新排序：星标的在前面，按星标时间倒序排列
    const sortedLinks = links.sort((a, b) => {
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;
        if (a.starred && b.starred) {
            return (b.starredAt || 0) - (a.starredAt || 0);
        }
        return 0;
    });

    await saveLinks(sortedLinks);
    return links[index];
}

// 获取排序后的链接列表
export async function getSortedLinks(): Promise<Link[]> {
    const links = await getLinks();

    return links.sort((a, b) => {
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;
        if (a.starred && b.starred) {
            return (b.starredAt || 0) - (a.starredAt || 0);
        }
        return 0;
    });
}