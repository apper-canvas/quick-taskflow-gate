import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const CategoryFilter = ({ 
  categories = [], 
  selectedCategory, 
  onCategoryChange, 
  showAllOption = true,
  className = '' 
}) => {
  const handleCategoryClick = (categoryId) => {
    onCategoryChange?.(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`space-y-2 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
      
      <div className="space-y-1">
        {showAllOption && (
          <Button
            variant={selectedCategory === null ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onCategoryChange?.(null)}
            className="w-full justify-start"
          >
            All Tasks
          </Button>
        )}
        
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={selectedCategory === category.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              className="w-full justify-between"
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
              <Badge variant="outline" size="sm">
                {category.taskCount || 0}
              </Badge>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;