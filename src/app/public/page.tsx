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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="container-custom mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">我的导航页</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            快速访问常用链接
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            管理员登录
          </button>
        </div>
      </header>
      
      <main className="container-custom max-w-6xl">
        <div className="space-y-6 relative">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
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
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="alphabetical">按字母排序</option>
                  <option value="recent">最近添加</option>
                  <option value="category">按分类排序</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Link count */}
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            显示 {sortedLinks.length} 个链接
            {selectedCategory !== 'all' && ` (分类: ${selectedCategory})`}
          </div>
          
          {/* Link grid */}
          {sortedLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
              {sortedLinks.map(link => (
                <div
                  key={link.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all p-3"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-md font-semibold mb-1 text-gray-900 dark:text-white">
                      {link.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {link.categories && link.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  {link.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">{link.description}</p>
                  )}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 break-all">
                    {link.url}
                  </p>
                  
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-medium text-primary hover:text-primary-hover transition-colors px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    访问链接
                    <svg className="ml-1.5 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 text-center rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCategory === 'all' 
                  ? '没有找到任何链接。'
                  : `没有找到分类为"${selectedCategory}"的链接。`
                }
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="container-custom mt-16 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} 我的个人导航页
        </p>
      </footer>
    </div>
  );
}