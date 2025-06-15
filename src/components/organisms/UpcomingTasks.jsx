import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/organisms/EmptyState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { taskService, categoryService } from '@/services';

const UpcomingTasks = ({ className = '' }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
const [upcomingTasks, categoriesData] = await Promise.all([
        taskService.getUpcoming(),
        categoryService.getAll()
      ]);
// Filter out subtasks from upcoming view to avoid duplicates
      const parentTasks = upcomingTasks.filter(task => !task.parent_task_id);
      setTasks(parentTasks);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load upcoming tasks');
      toast.error('Failed to load upcoming tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border p-6 shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
        </div>
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border p-6 shadow-sm ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
        </div>
        <ErrorState
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
        <Button
          variant="outline"
          size="sm"
          icon="Eye"
          onClick={() => window.location.href = '/tasks'}
        >
          View All
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No upcoming tasks"
          description="All caught up! No tasks due in the next 7 days."
          icon="Calendar"
          size="sm"
        />
      ) : (
        <div className="space-y-4">
          {tasks.slice(0, 5).map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
<TaskCard
                task={task}
                categories={categories}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
                showSubtasks={false}
                level={0}
              />
            </motion.div>
          ))}
          
          {tasks.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center pt-4"
            >
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/tasks'}
              >
                View {tasks.length - 5} more tasks
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpcomingTasks;