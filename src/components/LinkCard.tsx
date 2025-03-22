"use client";

import { useState } from 'react';
import { Link } from '@/lib/data';

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export default function LinkCard({ link, onEdit, onDelete, onToggleStar }: LinkCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all p-1.5 sm:p-3"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => setShowActions(true)}
    >
      <div className="flex items-start justify-between mb-0.5 sm:mb-1">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[65%] sm:max-w-[80%]">
          {link.title}
        </h3>
        
        <div className="flex space-x-0.5 sm:space-x-1 shrink-0">
          <button
            onClick={() => onToggleStar(link.id)}
            className={`p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              link.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
            aria-label={link.starred ? "取消星标" : "添加星标"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill={link.starred ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          {showActions && (
            <>
              <button
                onClick={() => onEdit(link)}
                className="text-primary hover:text-blue-700 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="编辑链接"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(link.id)}
                className="text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="删除链接"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* 分类标签与私密标志 */}
      <div className="flex flex-wrap gap-0.5 mb-0.5 sm:mb-1">
        {link.categories && link.categories.map((category, index) => (
          <span
            key={index}
            className="inline-block px-1 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full truncate max-w-[70px] sm:max-w-[100px]"
          >
            {category}
          </span>
        ))}
        
        {link.private && (
          <span className="inline-block px-1 py-0.5 text-[10px] font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-full">
            私密
          </span>
        )}
      </div>
      
      {/* 链接说明 - 如果有的话 */}
      {link.description && (
        <p className="text-[10px] text-gray-600 dark:text-gray-300 mb-0.5 sm:mb-1 line-clamp-2 leading-tight">{link.description}</p>
      )}
      
      {/* URL 与访问按钮 */}
      <div className="flex items-center justify-between mt-0.5 sm:mt-1">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[60%]">
          {link.url.replace(/^https?:\/\//, '')}
        </p>
        
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-[10px] font-medium text-primary hover:text-primary-hover transition-colors px-1 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
        >
          <span className="whitespace-nowrap">访问</span>
          <svg className="ml-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}