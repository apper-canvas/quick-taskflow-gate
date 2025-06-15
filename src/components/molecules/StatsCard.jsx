import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  className = '',
  ...props 
}) => {
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-all ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <ApperIcon 
                name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className={`w-4 h-4 mr-1 ${
                  trend.direction === 'up' ? 'text-success' : 'text-error'
                }`} 
              />
              <span className={trend.direction === 'up' ? 'text-success' : 'text-error'}>
                {trend.value}
              </span>
              <span className="text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;