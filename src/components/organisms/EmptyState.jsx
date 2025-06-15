import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = 'Nothing here yet', 
  description = 'Get started by adding your first item',
  icon = 'Package',
  actionLabel,
  onAction,
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: {
      icon: 'w-12 h-12',
      title: 'text-base',
      description: 'text-sm',
      padding: 'py-8'
    },
    md: {
      icon: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-base',
      padding: 'py-12'
    },
    lg: {
      icon: 'w-20 h-20',
      title: 'text-xl',
      description: 'text-lg',
      padding: 'py-16'
    }
  };

  const sizeConfig = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center ${sizeConfig.padding} ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-4"
      >
        <ApperIcon 
          name={icon} 
          className={`${sizeConfig.icon} text-gray-300 mx-auto`} 
        />
      </motion.div>
      
      <h3 className={`font-medium text-gray-900 mb-2 ${sizeConfig.title}`}>
        {title}
      </h3>
      
      <p className={`text-gray-500 mb-6 max-w-md ${sizeConfig.description}`}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;