import { useState, useEffect } from 'react';
import { Link } from '@/lib/data';
import { SortOption } from '@/types';

const defaultHeaders = {
    'Content-Type': 'application/json'
};

// Type-safe state update function
const createUpdater = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => {
    return (updater: (prev: T) => T): void => {
        setter((prev: T) => updater(prev));
    };
};

export const useLinks = (showToast: (message: string, type: 'success' | 'error' | 'info') => void) => {
    const [links, setLinks] = useState<Link[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortOption, setSortOption] = useState<SortOption>('alphabetical');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    // 创建类型安全的更新函数
    const updateLinks = createUpdater<Link[]>(setLinks);
    const updateCategories = createUpdater<string[]>(setCategories);

    // 类型安全的数组映射函数
    const mapLinks = (fn: (link: Link) => Link) => {
        updateLinks((prevLinks: Link[]) => prevLinks.map(fn));
    };

    const filterLinks = (fn: (link: Link) => boolean) => {
        updateLinks((prevLinks: Link[]) => prevLinks.filter(fn));
    };

    // Load links and categories
    const loadData = async () => {
        setIsLoading(true);
        try {
            const linksRes = await fetch('/api/links');
            const linksData = await linksRes.json();
            setLinks(linksData.links);

            const uniqueCategories = Array.from(
                new Set(linksData.links.flatMap((link: Link) => link.categories || []))
            ) as string[];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle adding a new link
    const addLink = async (linkData: Omit<Link, 'id'>) => {
        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify(linkData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    showToast('未授权操作：添加链接需要有效的访问令牌', 'error');
                    return;
                }

                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add link');
            }

            const newLink = await response.json();
            updateLinks((prevLinks: Link[]) => [...prevLinks, newLink]);

            // Update categories if new categories were added
            const newCategories = linkData.categories?.filter(cat => !categories.includes(cat)) || [];
            if (newCategories.length > 0) {
                setCategories(prevCategories => [...prevCategories, ...newCategories]);
            }

            showToast('链接添加成功！', 'success');
            return newLink;
        } catch (error) {
            console.error('Error adding link:', error);
            showToast(`添加链接失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
            throw error;
        }
    };

    // Handle updating a link
    const updateLink = async (linkData: Link) => {
        try {
            const response = await fetch('/api/links', {
                method: 'PUT',
                headers: defaultHeaders,
                body: JSON.stringify(linkData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    showToast('未授权操作：更新链接需要有效的访问令牌', 'error');
                    return;
                }

                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update link');
            }

            const updatedLink = await response.json();
            mapLinks((link: Link) => link.id === updatedLink.id ? updatedLink : link);

            // Update categories if new categories were added
            const newCategories = linkData.categories?.filter(cat => !categories.includes(cat)) || [];
            if (newCategories.length > 0) {
                updateCategories((prevCategories: string[]) => [...prevCategories, ...newCategories]);
            }

            showToast('链接更新成功！', 'success');
            return updatedLink;
        } catch (error) {
            console.error('Error updating link:', error);
            showToast(`更新链接失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
            throw error;
        }
    };

    // Handle toggling star status
    const toggleStar = async (id: string) => {
        try {
            const response = await fetch('/api/links/star', {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    showToast('未授权操作：更新星标需要有效的访问令牌', 'error');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to toggle star');
            }

            const updatedLink = await response.json();
            mapLinks((link: Link) =>
                link.id === id
                    ? { ...link, starred: updatedLink.starred, starredAt: updatedLink.starredAt }
                    : link
            );
            showToast(updatedLink.starred ? '已添加星标' : '已取消星标', 'success');
        } catch (error) {
            console.error('Error toggling star:', error);
            showToast(`操作失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
        }
    };

    // Handle deleting a link
    const deleteLink = async (id: string) => {
        if (confirm('确定要删除这个链接吗？')) {
            try {
                const response = await fetch(`/api/links/${id}`, {
                    method: 'DELETE',
                    headers: defaultHeaders,
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        showToast('未授权操作：删除链接需要有效的访问令牌', 'error');
                        return;
                    }

                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete link');
                }

                const result = await response.json();
                if (result.success) {
                    filterLinks((link: Link) => link.id !== id);

                    // Update categories if the last link with these categories was deleted
                    const remainingLinks = links.filter((link: Link) => link.id !== id);
                    const remainingCategories = Array.from(
                        new Set(remainingLinks.flatMap(link => link.categories || []))
                    );
                    setCategories(remainingCategories);

                    showToast('链接已成功删除', 'success');
                }
            } catch (error) {
                console.error('Error deleting link:', error);
                showToast(`删除链接失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
            }
        }
    };

    // Filter and sort links
    const getFilteredAndSortedLinks = () => {
        const filteredLinks = links.filter((link: Link) => {
            return selectedCategory === 'all' || link.categories?.includes(selectedCategory);
        });

        return [...filteredLinks].sort((a: Link, b: Link) => {
            if (a.starred && !b.starred) return -1;
            if (!a.starred && b.starred) return 1;
            if (a.starred && b.starred) {
                return (b.starredAt || 0) - (a.starredAt || 0);
            }

            switch (sortOption) {
                case 'starred':
                    return 0;
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'category':
                    const categoryA = a.categories && a.categories.length > 0 ? a.categories[0] : '';
                    const categoryB = b.categories && b.categories.length > 0 ? b.categories[0] : '';
                    return categoryA.localeCompare(categoryB) || a.title.localeCompare(b.title);
                case 'recent':
                    return parseInt(b.id) - parseInt(a.id);
                default:
                    return 0;
            }
        });
    };

    return {
        links: getFilteredAndSortedLinks(),
        categories,
        selectedCategory,
        setSelectedCategory,
        sortOption,
        setSortOption,
        isLoading,
        loadData,
        addLink,
        updateLink,
        toggleStar,
        deleteLink
    };
};