import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import SearchBar from '@/components/molecules/SearchBar';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/organisms/EmptyState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { taskService, categoryService } from '@/services';

const TaskList = ({ showFilters = true, showSearch = true, limit, onEditTask, onCreateSubtask }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchTerm, selectedCategory, sortBy, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

const filterAndSortTasks = () => {
    // Only show parent tasks (no subtasks) in main list
    let filtered = tasks.filter(task => !task.parentTaskId);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredTasks(filtered);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'createdAt', label: 'Created Date' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  if (loading) {
    return <SkeletonLoader count={3} />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      {(showFilters || showSearch) && (
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {showSearch && (
              <div className="flex-1 max-w-md">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search tasks..."
                />
              </div>
            )}
            
            {showFilters && (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  className="min-w-[150px]"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                  className="min-w-[150px]"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        {/* Category Filter Sidebar */}
        {showFilters && (
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="flex-1 min-w-0">
          {filteredTasks.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description={
                searchTerm || selectedCategory || statusFilter !== 'all'
                  ? "Try adjusting your filters or search terms"
                  : "Create your first task to get started"
              }
              actionLabel={
                searchTerm || selectedCategory || statusFilter !== 'all'
                  ? "Clear Filters"
                  : "Create Task"
              }
              onAction={() => {
                if (searchTerm || selectedCategory || statusFilter !== 'all') {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setStatusFilter('all');
                } else {
                  // Navigate to create task
                  window.location.href = '/tasks?create=true';
                }
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
                </h2>
                {!limit && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon="RefreshCw"
                    onClick={loadData}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                )}
              </div>
              
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
<TaskCard
                      task={task}
                      categories={categories}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                      onEdit={onEditTask}
                      onCreateSubtask={onCreateSubtask}
                      showSubtasks={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;