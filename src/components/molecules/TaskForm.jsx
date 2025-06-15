import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { taskService, categoryService } from '@/services';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    dueDate: '',
    reminderTime: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        categoryId: task.categoryId || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm") : '',
        reminderTime: task.reminderTime ? format(new Date(task.reminderTime), "yyyy-MM-dd'T'HH:mm") : ''
      });
    }
  }, [task]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
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
        dueDate: new Date(formData.dueDate).toISOString(),
        reminderTime: formData.reminderTime ? new Date(formData.reminderTime).toISOString() : null
      };

      let result;
      if (task) {
        result = await taskService.update(task.id, taskData);
        toast.success('Task updated successfully');
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border p-6 shadow-sm"
    >
      <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
        {task ? 'Edit Task' : 'Create New Task'}
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
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          options={categoryOptions}
          error={errors.categoryId}
          placeholder="Select a category"
          required
        />

        <Input
          label="Due Date"
          name="dueDate"
          type="datetime-local"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          required
        />

        <Input
          label="Reminder Time (Optional)"
          name="reminderTime"
          type="datetime-local"
          value={formData.reminderTime}
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
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;