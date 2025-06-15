import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { taskService, categoryService } from '@/services';

const TaskForm = ({ task, onSubmit, onCancel, parentTask }) => {
const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    due_date: '',
    reminder_time: '',
    status: 'pending',
    parent_task_id: parentTask?.id || null
  });
const [categories, setCategories] = useState([]);
  const [parentTasks, setParentTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

useEffect(() => {
    loadCategories();
    loadParentTasks();
    if (task) {
setFormData({
        title: task.title || '',
        description: task.description || '',
        category_id: task.category_id || '',
        due_date: task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd'T'HH:mm") : '',
        reminder_time: task.reminder_time ? format(new Date(task.reminder_time), "yyyy-MM-dd'T'HH:mm") : '',
        status: task.status || 'pending',
        parent_task_id: task.parent_task_id || null
      });
    } else if (parentTask) {
      setFormData(prev => ({
        ...prev,
        parent_task_id: parentTask.id,
        category_id: parentTask.category_id
      }));
    }
  }, [task, parentTask]);

const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const loadParentTasks = async () => {
    try {
      const data = await taskService.getParentTasks();
      // Filter out the current task if editing to prevent self-referencing
      const filteredTasks = task ? data.filter(t => t.id !== task.id) : data;
      setParentTasks(filteredTasks);
    } catch (error) {
      toast.error('Failed to load parent tasks');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    
if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

setLoading(true);
    try {
const taskData = {
        ...formData,
        due_date: new Date(formData.due_date).toISOString(),
        reminder_time: formData.reminder_time ? new Date(formData.reminder_time).toISOString() : null,
        parent_task_id: formData.parent_task_id || null
      };

let result;
      if (task) {
        result = await taskService.update(task.id, taskData);
        toast.success('Task updated successfully');
      } else if (parentTask) {
        result = await taskService.createSubtask(parentTask.id, taskData);
        toast.success('Subtask created successfully');
      } else {
        result = await taskService.create(taskData);
        toast.success('Task created successfully');
      }

      onSubmit?.(result);
    } catch (error) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  const parentTaskOptions = parentTasks.map(task => ({
    value: task.id,
    label: task.title
  }));

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];
return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
<div className="p-6">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            {task ? 'Edit Task' : parentTask ? `Create Subtask for "${parentTask.title}"` : 'Create New Task'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter task title"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Enter task description"
              />
            </div>

<Select
              label="Category"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              options={categoryOptions}
              error={errors.category_id}
              placeholder="Select a category"
              required
            />

            {!parentTask && (
<Select
                label="Parent Task (Optional)"
                name="parent_task_id"
                value={formData.parent_task_id || ''}
                onChange={handleChange}
                options={[
                  { value: '', label: 'No parent task' },
                  ...parentTaskOptions
                ]}
                placeholder="Select parent task"
              />
            )}

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              placeholder="Select status"
              required
            />

<Input
              label="Due Date"
              name="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={handleChange}
              error={errors.due_date}
              required
            />

<Input
              label="Reminder Time (Optional)"
              name="reminder_time"
              type="datetime-local"
              value={formData.reminder_time}
              onChange={handleChange}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
>
                {task ? 'Update Task' : parentTask ? 'Create Subtask' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskForm;