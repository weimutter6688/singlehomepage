'use client';

import { useState } from 'react';

export default function DataManagement() {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    try {
      const response = await fetch('/api/data/export', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('导出失败');
      }

      // 获取文件名
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') 
        || 'links-export.json';

      // 下载文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage('数据导出成功！');
    } catch (error) {
      console.error('导出错误:', error);
      setMessage('导出失败，请重试');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage('');

    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);

      const response = await fetch('/api/data/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('导入失败');
      }

      const result = await response.json();
      setMessage(`成功导入 ${result.count} 条记录！`);
      // 刷新页面以显示新数据
      window.location.reload();
    } catch (error) {
      console.error('导入错误:', error);
      setMessage('导入失败，请确保文件格式正确');
    } finally {
      setImporting(false);
      // 重置文件输入
      event.target.value = '';
    }
  };

  return (
    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">数据管理</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            导出数据
          </button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${
                importing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {importing ? '导入中...' : '导入数据'}
            </button>
          </div>
        </div>
        
        {message && (
          <p className={`mt-2 ${
            message.includes('失败') ? 'text-red-500' : 'text-green-500'
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}