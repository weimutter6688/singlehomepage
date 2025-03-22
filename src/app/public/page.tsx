'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/lib/data'; // Import only the type
import ThemeToggle from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';

export default function PublicPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'alphabetical' | 'recent' | 'category'>('alphabetical');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load links
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch links from API
        const linksRes = await fetch('/api/links');
        const linksData = await linksRes.json();
        setLinks(linksData.links);
        
        // Extract unique categories from links
        const uniqueCategories = Array.from(
          new Set(linksData.links.flatMap((link: Link) => link.categories || []))
        ) as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Filter links by selected category
  const filteredLinks = selectedCategory === 'all'
    ? links
    : links.filter(link => link.categories?.includes(selectedCategory));

  // Sort links based on selected sort option
  const sortedLinks = [...filteredLinks].sort((a, b) => {
    switch (sortOption) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="spinner"></div>
        <p className="ml-3 text-gray-600 dark:text-gray-300">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-10 px-2 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="container-custom mb-4 sm:mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">导航页</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <button
            onClick={() => router.push('/login')}
            className="h-8 px-3 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            管理员登录
          </button>
        </div>
      </header>
      
      <main className="container-custom max-w-6xl">
        <div className="space-y-6 relative">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-4 mb-3 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-8 text-xs px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="all">所有分类</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'alphabetical' | 'recent' | 'category')}
                className="h-8 text-xs px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="alphabetical">按字母排序</option>
                <option value="recent">最近添加</option>
                <option value="category">按分类排序</option>
              </select>
            </div>
          </div>
          
          {/* Link count */}
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            显示 {sortedLinks.length} 个链接
            {selectedCategory !== 'all' && ` (分类: ${selectedCategory})`}
          </div>
          
          {/* Link grid */}
          {sortedLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-1.5 sm:gap-2">
              {sortedLinks.map(link => (
                <div
                  key={link.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all p-1.5 sm:p-3"
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm sm:text-md font-semibold text-gray-900 dark:text-white truncate max-w-[90%]">
                      {link.title}
                    </h3>
                  </div>
                  
                  {/* 分类标签 */}
                  <div className="flex flex-wrap gap-0.5 mb-1">
                    {link.categories && link.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block px-1 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full truncate max-w-[70px] sm:max-w-[100px]"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  {/* 链接说明 - 如果有的话 */}
                  {link.description && (
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 mb-1 line-clamp-2 leading-tight">{link.description}</p>
                  )}
                  
                  {/* URL 与访问按钮 */}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[60%]">
                      {link.url.replace(/^https?:\/\//, '')}
                    </p>
                    
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[10px] font-medium text-primary hover:text-primary-hover transition-colors px-1 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                      <span className="whitespace-nowrap">Open</span>
                      <svg className="ml-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 text-center rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {selectedCategory === 'all'
                  ? '没有找到任何链接。'
                  : `没有找到分类为"${selectedCategory}"的链接。`
                }
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="container-custom mt-8 sm:mt-16 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} 我的个人导航页
        </p>
      </footer>
    </div>
  );
}