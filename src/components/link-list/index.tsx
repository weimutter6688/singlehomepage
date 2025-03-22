import { useState } from 'react';
import { Link } from '@/lib/data';
import { SortOption } from '@/types';
import { LinkForm } from '../link-form';
import { useLinks } from './hooks/useLinks';
import { useToast } from './hooks/useToast';
import { Toast } from './components/Toast';
import { Toolbar } from './components/Toolbar';
import { LinkGrid } from './components/LinkGrid';

export const LinkList = () => {
  const { toast, showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const {
    links,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    isLoading,
    addLink,
    updateLink,
    toggleStar,
    deleteLink
  } = useLinks(showToast);

  // Handle form submission (add or update)
  const handleFormSubmit = (linkData: Omit<Link, 'id'> | Link) => {
    if ('id' in linkData) {
      updateLink(linkData as Link);
    } else {
      addLink(linkData);
    }
    setShowForm(false);
    setEditingLink(null);
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
      <Toast {...toast} />

      <Toolbar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(e) => setSelectedCategory(e.target.value)}
        sortOption={sortOption}
        onSortChange={(e) => setSortOption(e.target.value as SortOption)}
        onAddClick={() => setShowForm(true)}
      />

      {showForm && (
        <LinkForm
          initialLink={editingLink || undefined}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm">
        显示 {links.length} 个链接
        {selectedCategory !== 'all' && ` (分类: ${selectedCategory})`}
      </div>

      <LinkGrid
        links={links}
        selectedCategory={selectedCategory}
        onEdit={handleEditLink}
        onDelete={deleteLink}
        onToggleStar={toggleStar}
      />
    </div>
  );
};

export default LinkList;