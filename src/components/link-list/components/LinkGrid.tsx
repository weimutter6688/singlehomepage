import { Link } from '@/lib/data';
import LinkCard from '@/components/LinkCard';

interface LinkGridProps {
  links: Link[];
  selectedCategory: string;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export const LinkGrid = ({
  links,
  selectedCategory,
  onEdit,
  onDelete,
  onToggleStar
}: LinkGridProps) => {
  if (links.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-8 text-center rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <p className="text-gray-600 dark:text-gray-400">
          {selectedCategory === 'all'
            ? '没有找到任何链接。添加一个新链接开始使用吧！'
            : `没有找到分类为"${selectedCategory}"的链接。`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
      {links.map(link => (
        <LinkCard
          key={link.id}
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStar={onToggleStar}
        />
      ))}
    </div>
  );
};