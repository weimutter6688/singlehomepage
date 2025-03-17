"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/lib/data';

interface LinkFormProps {
  initialLink?: Link;
  categories: string[];
  onSubmit: (link: Omit<Link, 'id'> | Link) => void;
  onCancel: () => void;
}

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

// Toast types
type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export default function LinkForm({ initialLink, categories, onSubmit, onCancel }: LinkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    url?: string;
    categories?: string;
  }>({});
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info'
  });

  // Initialize form with link data if editing
  useEffect(() => {
    if (initialLink) {
      setTitle(initialLink.title);
      setUrl(initialLink.url);
      setDescription(initialLink.description || '');
      setSelectedCategories(initialLink.categories || []);
    }
  }, [initialLink]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({
      visible: true,
      message,
      type
    });
  };

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      url?: string;
      categories?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = '请输入标题';
    }

    if (!url.trim()) {
      newErrors.url = '请输入URL';
    } else if (!URL_REGEX.test(url)) {
      newErrors.url = '请输入有效的URL';
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Auto-prepend https:// if protocol is missing
      setUrl(`https://${url}`);
    }

    if (selectedCategories.length === 0 && !newCategory.trim()) {
      newErrors.categories = '请至少选择一个分类';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add new category if entered
      const categories = [...selectedCategories];
      if (newCategory.trim() && !categories.includes(newCategory.trim())) {
        categories.push(newCategory.trim());
      }
      
      const linkData = {
        ...(initialLink && { id: initialLink.id }),
        title: title.trim(),
        url: url.trim(),
        description: description.trim() || undefined,
        categories: categories.length > 0 ? categories : []
      };
      
      await onSubmit(linkData);
      showToast(initialLink ? '链接已成功更新' : '链接已成功添加', 'success');
    } catch (error) {
      console.error('Form submission error:', error);
      showToast('提交表单时出错，请重试', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    
    // Clear category error if any categories are selected
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !selectedCategories.includes(newCategory.trim())) {
      setSelectedCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
      setShowNewCategory(false);
      
      // Clear category error if any categories are selected
      if (errors.categories) {
        setErrors(prev => ({ ...prev, categories: undefined }));
      }
    }
  };

  const handleUrlBlur = () => {
    // Validate URL format
    if (url.trim() && !URL_REGEX.test(url)) {
      setErrors(prev => ({ ...prev, url: '请输入有效的URL' }));
    } else if (url.trim() && !url.startsWith('http://') && !url.startsWith('https://')) {
      setUrl(`https://${url}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative">
      {/* Toast notification */}
      {toast.visible && (
        <div className={`absolute top-4 right-4 rounded-md px-4 py-2 shadow-lg transition-all transform animate-fade-in ${
          toast.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
          toast.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
          'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
        }`}>
          <div className="flex items-center">
            {toast.type === 'success' && (
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        {initialLink ? '编辑链接' : '添加新链接'}
      </h2>
      
      <form onSubmit={handleSubmit} className="transition-all">
        {/* Title field */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            标题 *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: undefined }));
              }
            }}
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
            onChange={(e) => {
              setUrl(e.target.value);
              if (errors.url) {
                setErrors(prev => ({ ...prev, url: undefined }));
              }
            }}
            onBlur={handleUrlBlur}
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
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white transition-colors"
            rows={2}
            disabled={isSubmitting}
            placeholder="可选的简短描述"
          />
        </div>
        
        {/* Categories section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            分类 * (可多选)
          </label>
          
          {/* Selected categories tags */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCategories.map(cat => (
                <div
                  key={cat}
                  className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm transform transition-transform hover:scale-105"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                    onClick={() => handleCategoryToggle(cat)}
                    disabled={isSubmitting}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Existing categories checkboxes */}
          <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories
              .filter(cat => !selectedCategories.includes(cat))
              .map(cat => (
                <div key={cat} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`cat-${cat}`}
                    onChange={() => handleCategoryToggle(cat)}
                    className="mr-2 focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded transition-colors"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor={`cat-${cat}`}
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat}
                  </label>
                </div>
              ))}
          </div>
          
          {/* Add new category */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                if (errors.categories && e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, categories: undefined }));
                }
              }}
              className={`flex-1 px-3 py-2 border ${errors.categories ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white transition-colors`}
              placeholder="输入新分类名称"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting || !newCategory.trim()}
            >
              添加分类
            </button>
          </div>
          
          {errors.categories && (
            <p className="mt-2 text-sm text-red-500">{errors.categories}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isSubmitting}
          >
            取消
          </button>
          <button
            type="submit"
            className={`px-5 py-2 ${isSubmitting ? 'bg-blue-400' : 'bg-primary hover:bg-primary-hover'} border border-transparent rounded-md shadow-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all flex items-center justify-center min-w-[100px]`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner mr-2 w-4 h-4 border-2"></div>
                <span>{initialLink ? '保存中...' : '添加中...'}</span>
              </>
            ) : (
              initialLink ? '保存更改' : '添加链接'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}