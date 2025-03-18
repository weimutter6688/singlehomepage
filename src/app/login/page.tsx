'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('登录页面 - 提交的令牌:', token);

      // Verify the token by making a request to an API endpoint
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        // 确保包含credentials以接收和发送cookie
        credentials: 'include'
      });

      if (response.ok) {
        // 登录成功后强制刷新页面以确保cookie生效
        window.location.href = '/';
      } else {
        const data = await response.json();
        setError(data.error || '令牌无效');
      }
    } catch (error) {
      setError('验证过程中发生错误');
      console.error('认证失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPublicView = () => {
    router.push('/public');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">管理员登录</h1>
          <p className="text-gray-600 dark:text-gray-300">请输入访问令牌继续</p>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              访问令牌
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              autoFocus
              placeholder="请输入令牌"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? '验证中...' : '登录管理'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={goToPublicView}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            返回公开浏览页面
          </button>
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            访问令牌可在环境变量中配置
          </p>
        </div>
      </div>
    </div>
  );
}