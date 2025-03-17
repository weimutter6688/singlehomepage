'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LinkList from '@/components/LinkList';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        // Attempt to access an authenticated endpoint
        const response = await fetch('/api/auth/verify', {
          method: 'GET'
        });
        
        if (response.status === 401) {
          // Not authenticated, redirect to public page
          router.replace('/public');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, default to public page
        router.replace('/public');
      }
    }
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    if (confirm('确定要登出系统吗？')) {
      setIsLoggingOut(true);
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Redirect to public page after logout
          router.replace('/public');
        }
      } catch (error) {
        console.error('登出失败:', error);
        alert('登出过程中发生错误');
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  // Show loading state until authentication check completes
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
        <p className="ml-3 text-gray-600 dark:text-gray-300">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="container-custom mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">我的导航页 (管理员视图)</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            快速访问常用链接
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          <button
            onClick={() => router.push('/public')}
            className="px-4 py-2 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-300 dark:hover:bg-blue-600 transition-colors mr-2"
          >
            公开视图
          </button>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isLoggingOut ? '登出中...' : '登出'}
          </button>
        </div>
      </header>
      
      <main className="container-custom max-w-6xl">
        <LinkList />
      </main>
      
      <footer className="container-custom mt-16 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} 我的个人导航页
        </p>
      </footer>
    </div>
  );
}
