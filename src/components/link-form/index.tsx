import React from 'react';
import { LinkFormProps } from './types';
import { useForm } from './hooks/useForm';
import { Toast } from './components/Toast';
import { FormFields } from './components/FormFields';
import { CategorySection } from './components/CategorySection';

export const LinkForm: React.FC<LinkFormProps> = ({
  initialLink,
  categories,
  onSubmit,
  onCancel
}) => {
  const {
    title,
    url,
    description,
    isPrivate,
    selectedCategories,
    newCategory,
    isSubmitting,
    errors,
    toast,
    handleSubmit,
    handleUrlBlur,
    handleCategoryToggle,
    handleAddNewCategory,
    setTitle,
    setUrl,
    setDescription,
    setIsPrivate,
    setNewCategory
  } = useForm({ initialLink, onSubmit });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative">
      <Toast toast={toast} />
      
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        {initialLink ? '编辑链接' : '添加新链接'}
      </h2>
      
      <form onSubmit={handleSubmit} className="transition-all">
        <FormFields
          title={title}
          url={url}
          description={description}
          isPrivate={isPrivate}
          errors={errors}
          isSubmitting={isSubmitting}
          onTitleChange={setTitle}
          onUrlChange={setUrl}
          onDescriptionChange={setDescription}
          onPrivateChange={setIsPrivate}
          onUrlBlur={handleUrlBlur}
        />
        
        <CategorySection
          selectedCategories={selectedCategories}
          categories={categories}
          newCategory={newCategory}
          errors={errors}
          isSubmitting={isSubmitting}
          onCategoryToggle={handleCategoryToggle}
          onNewCategoryChange={setNewCategory}
          onAddNewCategory={handleAddNewCategory}
        />
        
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
};

export default LinkForm;