"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/lib/data'; // Import only the type
import LinkCard from './LinkCard';
import LinkForm from './LinkForm';

type SortOption = 'alphabetical' | 'recent' | 'category';

// Default headers for API calls
const defaultHeaders = {
  'Content-Type': 'application/json'
};

export default function LinkList() {
  const [links, setLinks] = useState<Link[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical');
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load links and categories
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch links from API
        const linksRes = await fetch('/api/links');
        const linksData = await linksRes.json();
        setLinks(linksData.links);
        
        // Extract unique categories from links - flatten all categories arrays
        const uniqueCategories = Array.from(new Set(linksData.links.flatMap((link: Link) => link.categories || []))) as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'info'
  });

  // Show toast message
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      visible: true,
      message,
      type
    });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Handle adding a new link
  const handleAddLink = async (linkData: Omit<Link, 'id'>) => {
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(linkData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          showToast('未授权操作：添加链接需要有效的访问令牌', 'error');
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add link');
      }
      
      const newLink = await response.json();
      setLinks(prevLinks => [...prevLinks, newLink]);
      
      // Update categories if new categories were added
      const newCategories = linkData.categories?.filter(cat => !categories.includes(cat)) || [];
      if (newCategories.length > 0) {
        setCategories(prevCategories => [...prevCategories, ...newCategories]);
      }
      
      setShowForm(false);
      showToast('链接添加成功！', 'success');
      return newLink;
    } catch (error) {
      console.error('Error adding link:', error);
      showToast(`添加链接失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
      throw error;
    }
  };

  // Handle updating a link
  const handleUpdateLink = async (linkData: Link) => {
    try {
      const response = await fetch('/api/links', {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(linkData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          showToast('未授权操作：更新链接需要有效的访问令牌', 'error');
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update link');
      }
      
      const updatedLink = await response.json();
      setLinks(prevLinks => prevLinks.map(link => link.id === updatedLink.id ? updatedLink : link));
      
      // Update categories if new categories were added
      const newCategories = linkData.categories?.filter(cat => !categories.includes(cat)) || [];
      if (newCategories.length > 0) {
        setCategories(prevCategories => [...prevCategories, ...newCategories]);
      }
      
      setEditingLink(null);
      setShowForm(false);
      showToast('链接更新成功！', 'success');
      return updatedLink;
    } catch (error) {
      console.error('Error updating link:', error);
      showToast(`更新链接失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
      throw error;
    }
  };

  // Handle deleting a link
  const handleDeleteLink = async (id: string) => {
    if (confirm('确定要删除这个链接吗？')) {
      try {
        const response = await fetch(`/api/links/${id}`, {
          method: 'DELETE',
          headers: defaultHeaders,
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            showToast('未授权操作：删除链接需要有效的访问令牌', 'error');
            return;
          }
          
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete link');
        }
        
        const result = await response.json();
        if (result.success) {
          // Optimistically update UI
          setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
          
          // Update categories if the last link with these categories was deleted
          const remainingLinks = links.filter(link => link.id !== id);
          const remainingCategories = Array.from(
            new Set(remainingLinks.flatMap(link => link.categories || []))
          );
          setCategories(remainingCategories);
          
          // Show success message
          showToast('链接已成功删除', 'success');
        }
      } catch (error) {
        console.error('Error deleting link:', error);
        showToast(`删除链接失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
      }
    }
  };

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
        // For multiple categories, compare first category of each
        const categoryA = a.categories && a.categories.length > 0 ? a.categories[0] : '';
        const categoryB = b.categories && b.categories.length > 0 ? b.categories[0] : '';
        return categoryA.localeCompare(categoryB) || a.title.localeCompare(b.title);
      case 'recent':
        // Since we don't have a timestamp, sort by ID (assuming higher ID = more recent)
        return parseInt(b.id) - parseInt(a.id);
      default:
        return 0;
    }
  });

  // Handle form submission (add or update)
  const handleFormSubmit = (linkData: Omit<Link, 'id'> | Link) => {
    if ('id' in linkData) {
      handleUpdateLink(linkData as Link);
    } else {
      handleAddLink(linkData);
    }
  };

  // Start editing a link
  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setShowForm(true);
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingLink(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="spinner"></div>
        <p className="ml-3 text-gray-600 dark:text-gray-300">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast notification */}
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-md px-4 py-2 shadow-lg transform transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
            toast.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
            'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
          } animate-fade-in`}
        >
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
            {toast.type === 'info' && (
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

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
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            >
              <option value="alphabetical">按字母排序</option>
              <option value="recent">最近添加</option>
              <option value="category">按分类排序</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-5 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            添加新链接
          </button>
        </div>
      </div>
      
      {/* Form for adding/editing */}
      {showForm && (
        <LinkForm
          initialLink={editingLink || undefined}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}
      
      {/* Link count */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
        显示 {sortedLinks.length} 个链接
        {selectedCategory !== 'all' && ` (分类: ${selectedCategory})`}
      </div>
      
      {/* Link grid */}
      {sortedLinks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
          {sortedLinks.map(link => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={handleEditLink}
              onDelete={handleDeleteLink}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 text-center rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory === 'all' 
              ? '没有找到任何链接。添加一个新链接开始使用吧！'
              : `没有找到分类为"${selectedCategory}"的链接。`
            }
          </p>
        </div>
      )}
    </div>
  );
}