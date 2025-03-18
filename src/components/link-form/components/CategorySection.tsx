import React from 'react';
import { ErrorState } from '../types';

interface CategorySectionProps {
  selectedCategories: string[];
  categories: string[];
  newCategory: string;
  errors: ErrorState;
  isSubmitting: boolean;
  onCategoryToggle: (category: string) => void;
  onNewCategoryChange: (value: string) => void;
  onAddNewCategory: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategories,
  categories,
  newCategory,
  errors,
  isSubmitting,
  onCategoryToggle,
  onNewCategoryChange,
  onAddNewCategory,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        分类 * (可多选)
      </label>
      
      {/* Selected categories tags */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedCategories.map((cat: string) => (
            <div
              key={cat}
              className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm transform transition-transform hover:scale-105"
            >
              <span>{cat}</span>
              <button
                type="button"
                className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                onClick={() => onCategoryToggle(cat)}
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
                onChange={() => onCategoryToggle(cat)}
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
          onChange={(e) => onNewCategoryChange(e.target.value)}
          className={`flex-1 px-3 py-2 border ${errors.categories ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white transition-colors`}
          placeholder="输入新分类名称"
          disabled={isSubmitting}
        />
        <button
          type="button"
          onClick={onAddNewCategory}
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
  );
};