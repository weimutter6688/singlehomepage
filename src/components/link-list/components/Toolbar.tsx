import { ChangeEvent } from 'react';
import { SortOption } from '@/types';

interface ToolbarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  sortOption: SortOption;
  onSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onAddClick: () => void;
}

export const Toolbar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  onAddClick
}: ToolbarProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-4 mb-3 sm:mb-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <select
            value={selectedCategory}
            onChange={onCategoryChange}
            className="text-xs px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary flex-1"
          >
            <option value="all">全部分类</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={onSortChange}
            className="text-xs px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary flex-1"
          >
            <option value="starred">按星标</option>
            <option value="alphabetical">按字母</option>
            <option value="recent">最近添加</option>
            <option value="category">按分类</option>
          </select>
        </div>

        <button
          onClick={onAddClick}
          className="shrink-0 flex items-center justify-center h-7 px-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors text-xs"
        >
          <span>添加链接</span>
          <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};