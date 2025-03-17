'use client';

import { useState } from 'react';
import { setAccessToken } from '@/lib/client-auth';

export default function TokenInput() {
  const [token, setToken] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveToken = () => {
    if (!token.trim()) {
      setMessage('令牌不能为空');
      return;
    }
    
    setAccessToken(token);
    setMessage('访问令牌已保存');
    setTimeout(() => {
      setMessage('');
      setShowInput(false);
    }, 1500);
  };

  return (
    <div className="mt-4">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          设置访问令牌
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="输入访问令牌"
              className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800"
            />
            <button
              onClick={handleSaveToken}
              className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              保存
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              取消
            </button>
          </div>
          {message && (
            <p className="text-xs text-green-500">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}