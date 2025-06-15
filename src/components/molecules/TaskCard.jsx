import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast, isThisWeek } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';
import { taskService, categoryService } from '@/services';

const TaskCard = ({ task, onUpdate, onDelete, categories = [], onEdit, onCreateSubtask, showSubtasks = true, level = 0 }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [subtaskProgress, setSubtaskProgress] = useState({ total: 0, completed: 0, percentage: 0 });
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);

const category = categories.find(c => c.id === task.category_id);
  const dueDate = new Date(task.due_date);
  const isOverdue = isPast(dueDate) && task.status !== 'completed';
  const isDueToday = isToday(dueDate);
  const isDueThisWeek = isThisWeek(dueDate);
  const isParentTask = !task.parent_task_id;
  useEffect(() => {
    if (showSubtasks && isParentTask) {
      loadSubtasks();
      loadSubtaskProgress();
    }
  }, [task.id, showSubtasks, isParentTask]);

  const loadSubtasks = async () => {
    if (!isParentTask) return;
    
    setLoadingSubtasks(true);
    try {
      const subtaskData = await taskService.getSubtasks(task.id);
      setSubtasks(subtaskData);
    } catch (error) {
      toast.error('Failed to load subtasks');
    } finally {
      setLoadingSubtasks(false);
    }
  };

  const loadSubtaskProgress = async () => {
    if (!isParentTask) return;
    
    try {
const progress = await taskService.getSubtaskProgress(task.id);
      setSubtaskProgress(progress);
    } catch (error) {
      console.error('Failed to load subtask progress');
    }
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const updatedTask = await taskService.update(task.id, { status: newStatus });
      onUpdate?.(updatedTask);
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}!`);
    } catch (error) {
      toast.error('Failed to update task status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await taskService.delete(task.id);
      onDelete?.(task.id);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
};

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleCreateSubtask = () => {
    onCreateSubtask?.(task);
  };

  const handleSubtaskUpdate = (updatedSubtask) => {
    setSubtasks(prev => prev.map(st => 
      st.id === updatedSubtask.id ? updatedSubtask : st
    ));
    loadSubtaskProgress();
    onUpdate?.(updatedSubtask);
  };

  const handleSubtaskDelete = (subtaskId) => {
    setSubtasks(prev => prev.filter(st => st.id !== subtaskId));
    loadSubtaskProgress();
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const getDueDateColor = () => {
    if (task.status === 'completed') return 'text-gray-500';
    if (isOverdue) return 'text-error';
    if (isDueToday) return 'text-warning';
    return 'text-gray-600';
  };

  const getDueDateText = () => {
    if (isOverdue) return `Overdue ${format(dueDate, 'MMM d')}`;
    if (isDueToday) return 'Due today';
    if (isDueThisWeek) return format(dueDate, 'EEEE');
    return format(dueDate, 'MMM d, yyyy');
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      default: return 'default';
    }
  };

const marginLeft = level * 24;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: level === 0 ? 1.02 : 1.01 }}
      className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${
        task.status === 'completed' ? 'opacity-75' : ''
      } ${isOverdue ? 'border-l-4 border-l-error' : ''} ${
        level > 0 ? 'border-l-2 border-l-gray-200 bg-gray-50' : ''
      }`}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.status === 'completed'}
            onChange={handleStatusToggle}
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium ${
                task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-sm text-gray-600 break-words">
                  {task.description}
                </p>
              )}
            </div>
            
<div className="flex items-center space-x-2 ml-3">
              {isParentTask && showSubtasks && subtasks.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={isExpanded ? "ChevronUp" : "ChevronDown"}
                  className="text-gray-400 hover:text-gray-600"
                  onClick={toggleExpansion}
                  disabled={loadingSubtasks}
                />
              )}
              {isParentTask && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Plus"
                  className="text-gray-400 hover:text-primary"
                  onClick={handleCreateSubtask}
                  disabled={isUpdating || isDeleting}
                  title="Add Subtask"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                icon="Edit"
                className="text-gray-400 hover:text-gray-600"
                onClick={handleEdit}
                disabled={isUpdating || isDeleting}
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                className="text-gray-400 hover:text-error"
                onClick={handleDelete}
                loading={isDeleting}
                disabled={isUpdating}
              />
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {category && (
                <Badge color={category.color} size="sm">
                  {category.name}
                </Badge>
              )}
              <Badge variant={getStatusColor()} size="sm">
                {task.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <ApperIcon 
                name={isOverdue ? "AlertCircle" : "Calendar"} 
                className={`w-4 h-4 ${getDueDateColor()}`} 
              />
              <span className={getDueDateColor()}>
                {getDueDateText()}
              </span>
            </div>
</div>

          {/* Subtask Progress Bar */}
          {isParentTask && showSubtasks && subtaskProgress.total > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Subtasks Progress</span>
                <span>{subtaskProgress.completed}/{subtaskProgress.total} completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subtaskProgress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
</div>

      {/* Subtasks */}
      {showSubtasks && isParentTask && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-3"
        >
          <AnimatePresence>
            {subtasks.map((subtask) => (
              <TaskCard
                key={subtask.id}
                task={subtask}
                categories={categories}
                onUpdate={handleSubtaskUpdate}
                onDelete={handleSubtaskDelete}
                onEdit={onEdit}
                showSubtasks={false}
                level={level + 1}
              />
            ))}
          </AnimatePresence>
          {subtasks.length === 0 && !loadingSubtasks && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No subtasks yet
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskCard;