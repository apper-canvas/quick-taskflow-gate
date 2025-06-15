import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import TaskList from '@/components/organisms/TaskList';
import TaskForm from '@/components/molecules/TaskForm';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    // Check if create parameter is present in URL
    if (searchParams.get('create') === 'true') {
      setShowCreateForm(true);
      // Remove the parameter from URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleCreateTask = () => {
    setShowCreateForm(true);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowCreateForm(true);
  };

  const handleFormSubmit = (task) => {
    setShowCreateForm(false);
    setEditingTask(null);
    // The TaskList component will automatically refresh
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingTask(null);
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Tasks
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your tasks and stay organized.
            </p>
          </div>
          
          <Button
            onClick={handleCreateTask}
            icon="Plus"
            className="w-full sm:w-auto"
          >
            Create Task
          </Button>
        </div>
      </motion.div>

{/* Create/Edit Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <div onClick={handleFormCancel}>
            <TaskForm
              task={editingTask}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TaskList
          showFilters={true}
          showSearch={true}
        />
      </motion.div>

      {/* Floating Action Button for Mobile */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-30 sm:hidden"
      >
        <Button
          onClick={handleCreateTask}
          className="w-14 h-14 rounded-full shadow-lg"
          icon="Plus"
        />
      </motion.div>
    </div>
  );
};

export default Tasks;