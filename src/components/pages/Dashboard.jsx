import { motion } from 'framer-motion';
import DashboardStats from '@/components/organisms/DashboardStats';
import UpcomingTasks from '@/components/organisms/UpcomingTasks';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Dashboard = () => {
  const handleCreateTask = () => {
    window.location.href = '/tasks?create=true';
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
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your task overview.
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

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <DashboardStats />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <UpcomingTasks />
        </motion.div>

        {/* Quick Actions Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={handleCreateTask}
                icon="Plus"
                className="w-full justify-start"
              >
                Create New Task
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/tasks'}
                icon="List"
                className="w-full justify-start"
              >
                View All Tasks
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/categories'}
                icon="Tags"
                className="w-full justify-start"
              >
                Manage Categories
              </Button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <ApperIcon name="Calendar" className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Today's Focus</h3>
            </div>
            <p className="text-white/90 mb-4">
              Stay focused and productive. Every completed task brings you closer to your goals.
            </p>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm text-white/90">
                "The key is not to prioritize what's on your schedule, but to schedule your priorities."
              </p>
              <p className="text-xs text-white/70 mt-2">- Stephen Covey</p>
            </div>
          </div>

          {/* Productivity Tip */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Lightbulb" className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Productivity Tip</h3>
            </div>
            <p className="text-sm text-gray-600">
              Break large tasks into smaller, manageable chunks. This makes them less overwhelming and easier to complete.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;