import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatsCard from '@/components/molecules/StatsCard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { taskService } from '@/services';

const DashboardStats = ({ className = '' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadStats}
      />
    );
  }

  if (!stats) return null;

  const statsCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: 'CheckSquare',
      color: 'primary'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: 'Clock',
      color: 'warning'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: 'AlertCircle',
      color: 'error'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatsCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;