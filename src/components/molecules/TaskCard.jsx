import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, isThisWeek } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';
import { taskService, categoryService } from '@/services';

const TaskCard = ({ task, onUpdate, onDelete, categories = [] }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const category = categories.find(c => c.id === task.categoryId);
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && task.status !== 'completed';
  const isDueToday = isToday(dueDate);
  const isDueThisWeek = isThisWeek(dueDate);

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${
        task.status === 'completed' ? 'opacity-75' : ''
      } ${isOverdue ? 'border-l-4 border-l-error' : ''}`}
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
              <Button
                variant="ghost"
                size="sm"
                icon="Edit"
                className="text-gray-400 hover:text-gray-600"
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
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;