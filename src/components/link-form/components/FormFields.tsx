import React from 'react';
import { ErrorState } from '../types';

interface FormFieldsProps {
  title: string;
  url: string;
  description: string;
  isPrivate: boolean;
  errors: ErrorState;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPrivateChange: (value: boolean) => void;
  onUrlBlur: () => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  title,
  url,
  description,
  isPrivate,
  errors,
  isSubmitting,
  onTitleChange,
  onUrlChange,
  onDescriptionChange,
  onPrivateChange,
  onUrlBlur,
}) => {
  return (
    <>
      {/* Title field */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          标题 *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white transition-colors`}
          required
          disabled={isSubmitting}
          placeholder="给链接起一个标题"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>
      
      {/* URL field */}
      <div className="mb-4">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL *
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onBlur={onUrlBlur}
          className={`w-full px-3 py-2 border ${errors.url ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white transition-colors`}
          placeholder="https://example.com"
          required
          disabled={isSubmitting}
        />
        {errors.url ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url}</p>
        ) : (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">如果省略 http:// 或 https://，将自动添加 https://</p>
        )}
      </div>
      
      {/* Description field */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          描述
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white transition-colors"
          rows={2}
          disabled={isSubmitting}
          placeholder="可选的简短描述"
        />
      </div>

      {/* Private field */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={(e) => onPrivateChange(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="private" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            设为私密链接（仅认证用户可见）
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
          私密链接只有在使用访问令牌验证后才能查看
        </p>
      </div>
    </>
  );
};