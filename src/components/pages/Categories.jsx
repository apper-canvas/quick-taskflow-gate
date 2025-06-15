import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import EmptyState from '@/components/organisms/EmptyState';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { categoryService } from '@/services';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#5B21B6' });
  const [formLoading, setFormLoading] = useState(false);

  const predefinedColors = [
    '#5B21B6', // Primary purple
    '#10B981', // Success green
    '#F59E0B', // Warning amber
    '#EF4444', // Error red
    '#3B82F6', // Info blue
    '#8B5CF6', // Secondary purple
    '#EC4899', // Pink
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#6366F1', // Indigo
    '#A855F7'  // Violet
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', color: '#5B21B6' });
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setFormLoading(true);
    try {
      let result;
      if (editingCategory) {
        result = await categoryService.update(editingCategory.id, formData);
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? result : cat
        ));
        toast.success('Category updated successfully');
      } else {
        result = await categoryService.create(formData);
        setCategories(prev => [...prev, result]);
        toast.success('Category created successfully');
      }
      
      setShowForm(false);
      setFormData({ name: '', color: '#5B21B6' });
      setEditingCategory(null);
    } catch (error) {
      toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await categoryService.delete(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setFormData({ name: '', color: '#5B21B6' });
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Categories</h1>
        </div>
        <SkeletonLoader count={3} type="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Categories</h1>
        </div>
        <ErrorState message={error} onRetry={loadCategories} />
      </div>
    );
  }

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
              Categories
            </h1>
            <p className="text-gray-600 mt-1">
              Organize your tasks with custom categories.
            </p>
          </div>
          
          <Button
            onClick={handleCreateCategory}
            icon="Plus"
            className="w-full sm:w-auto"
          >
            Create Category
          </Button>
        </div>
      </motion.div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  label="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category Color
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          formData.color === color
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Custom color</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleFormCancel}
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={formLoading}
                    disabled={formLoading}
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create your first category to organize your tasks"
            actionLabel="Create Category"
            onAction={handleCreateCategory}
            icon="Tags"
          />
        ) : (
<div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
              </h2>
            </div>
<div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.taskCount || 0} tasks
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        color={category.color} 
                        size="sm"
                      >
                        {category.taskCount || 0} tasks
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => handleEditCategory(category)}
                        className="text-gray-400 hover:text-gray-600"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-gray-400 hover:text-error"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Categories;