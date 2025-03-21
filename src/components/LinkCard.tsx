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
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-all p-3"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-md font-semibold mb-1 text-gray-900 dark:text-white">
          {link.title}
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleStar(link.id)}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              link.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
            aria-label={link.starred ? "取消星标" : "添加星标"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={link.starred ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          {showActions && (
            <>
              <button
                onClick={() => onEdit(link)}
                className="text-primary hover:text-blue-700 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="编辑链接"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(link.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="删除链接"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
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
        
        {link.private && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 rounded-full">
            私密
          </span>
        )}
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
  );
}