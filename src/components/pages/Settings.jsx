import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Checkbox from '@/components/atoms/Checkbox';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { userPreferencesService } from '@/services';

const Settings = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userPreferencesService.get();
      setPreferences(data);
    } catch (err) {
      setError(err.message || 'Failed to load preferences');
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userPreferencesService.update(preferences);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to default values?')) {
      return;
    }

    setSaving(true);
    try {
      const defaultPreferences = await userPreferencesService.reset();
      setPreferences(defaultPreferences);
      toast.success('Settings reset to default values');
    } catch (error) {
      toast.error('Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const viewOptions = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'tasks', label: 'Tasks' },
    { value: 'categories', label: 'Categories' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'createdAt', label: 'Created Date' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];

  const reminderOffsetOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 1440, label: '1 day' }
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
        </div>
        <div className="max-w-2xl">
          <SkeletonLoader count={4} type="list" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
        </div>
        <div className="max-w-2xl">
          <ErrorState message={error} onRetry={loadPreferences} />
        </div>
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
              Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Customize your TaskFlow experience.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              loading={saving}
              disabled={saving}
              icon="RotateCcw"
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={saving}
              icon="Save"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Settings Form */}
      <div className="max-w-2xl">
        <div className="space-y-8">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border p-6 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                General Settings
              </h2>
            </div>

            <div className="space-y-4">
              <Select
                label="Default View"
                value={preferences?.defaultView || 'dashboard'}
                onChange={(e) => updatePreference('defaultView', e.target.value)}
                options={viewOptions}
              />

              <Select
                label="Default Sort Order"
                value={preferences?.sortOrder || 'dueDate'}
                onChange={(e) => updatePreference('sortOrder', e.target.value)}
                options={sortOptions}
              />

              <Select
                label="Theme"
                value={preferences?.theme || 'light'}
                onChange={(e) => updatePreference('theme', e.target.value)}
                options={themeOptions}
              />

              <Checkbox
                label="Show completed tasks by default"
                checked={preferences?.showCompletedTasks || false}
                onChange={(e) => updatePreference('showCompletedTasks', e.target.checked)}
              />
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border p-6 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-info rounded-lg flex items-center justify-center">
                <ApperIcon name="Bell" className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Enable browser notifications"
                checked={preferences?.notificationsEnabled || false}
                onChange={(e) => updatePreference('notificationsEnabled', e.target.checked)}
              />

              <Select
                label="Default Reminder Time"
                value={preferences?.reminderOffset || 60}
                onChange={(e) => updatePreference('reminderOffset', parseInt(e.target.value))}
                options={reminderOffsetOptions}
                disabled={!preferences?.notificationsEnabled}
              />

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" className="w-5 h-5 text-info mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Browser Notifications
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Make sure to allow notifications in your browser settings to receive reminders for your tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data & Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border p-6 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Data & Privacy
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Database" className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Local Storage
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Your tasks and data are stored locally in your browser. No personal information is sent to external servers.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm('This will clear all your tasks and data. This action cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                icon="Trash2"
                className="text-error hover:text-error"
              >
                Clear All Data
              </Button>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 text-white"
          >
            <div className="flex items-center space-x-3 mb-4">
              <ApperIcon name="CheckSquare" className="w-8 h-8" />
              <h2 className="text-lg font-semibold">
                TaskFlow
              </h2>
            </div>
            <p className="text-white/90 mb-4">
              A clean and efficient task management application designed to help you stay organized and productive.
            </p>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm">
                Version 1.0.0
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;