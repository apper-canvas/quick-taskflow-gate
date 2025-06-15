import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const getSkeletonContent = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-2">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {getSkeletonContent()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;