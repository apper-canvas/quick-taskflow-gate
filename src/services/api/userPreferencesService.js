import { toast } from 'react-toastify';

class UserPreferencesService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async get() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'default_view', 'notifications_enabled', 'theme', 'sort_order', 'show_completed_tasks', 'reminder_offset']
      };
      
      const response = await this.apperClient.fetchRecords('user_preference', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return {
          default_view: 'dashboard',
          notifications_enabled: true,
          theme: 'light',
          sort_order: 'dueDate',
          show_completed_tasks: false,
          reminder_offset: 60
        };
      }
      
      const data = response.data && response.data.length > 0 ? response.data[0] : null;
      
      if (!data) {
        // Create default preferences if none exist
        return await this.createDefault();
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      // Return default preferences on error
      return {
        default_view: 'dashboard',
        notifications_enabled: true,
        theme: 'light',
        sort_order: 'dueDate',
        show_completed_tasks: false,
        reminder_offset: 60
      };
    }
  }

  async createDefault() {
    try {
      const defaultPrefs = {
        default_view: 'dashboard',
        notifications_enabled: true,
        theme: 'light',
        sort_order: 'dueDate',
        show_completed_tasks: false,
        reminder_offset: 60
      };

      const params = {
        records: [defaultPrefs]
      };
      
      const response = await this.apperClient.createRecord('user_preference', params);
      
      if (!response.success) {
        console.error(response.message);
        return defaultPrefs;
      }
      
      if (response.results && response.results.length > 0 && response.results[0].success) {
        return response.results[0].data;
      }
      
      return defaultPrefs;
    } catch (error) {
      console.error("Error creating default preferences:", error);
      return {
        default_view: 'dashboard',
        notifications_enabled: true,
        theme: 'light',
        sort_order: 'dueDate',
        show_completed_tasks: false,
        reminder_offset: 60
      };
    }
  }

  async update(updates) {
    try {
      // First get current preferences to get the ID
      const currentPrefs = await this.get();
      
      if (!currentPrefs.Id) {
        // If no existing preferences, create new ones
        const params = {
          records: [updates]
        };
        
        const response = await this.apperClient.createRecord('user_preference', params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return null;
        }
        
        return response.results && response.results.length > 0 && response.results[0].success 
          ? response.results[0].data 
          : null;
      }

      const updateData = {
        Id: currentPrefs.Id
      };
      
      // Only include updateable fields
      if (updates.default_view !== undefined) updateData.default_view = updates.default_view;
      if (updates.defaultView !== undefined) updateData.default_view = updates.defaultView;
      if (updates.notifications_enabled !== undefined) updateData.notifications_enabled = updates.notifications_enabled;
      if (updates.notificationsEnabled !== undefined) updateData.notifications_enabled = updates.notificationsEnabled;
      if (updates.theme !== undefined) updateData.theme = updates.theme;
      if (updates.sort_order !== undefined) updateData.sort_order = updates.sort_order;
      if (updates.sortOrder !== undefined) updateData.sort_order = updates.sortOrder;
      if (updates.show_completed_tasks !== undefined) updateData.show_completed_tasks = updates.show_completed_tasks;
      if (updates.showCompletedTasks !== undefined) updateData.show_completed_tasks = updates.showCompletedTasks;
      if (updates.reminder_offset !== undefined) updateData.reminder_offset = updates.reminder_offset;
      if (updates.reminderOffset !== undefined) updateData.reminder_offset = updates.reminderOffset;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('user_preference', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  }

  async reset() {
    try {
      const defaultPrefs = {
        default_view: 'dashboard',
        notifications_enabled: true,
        theme: 'light',
        sort_order: 'dueDate',
        show_completed_tasks: false,
        reminder_offset: 60
      };
      
      const updatedPrefs = await this.update(defaultPrefs);
      return updatedPrefs || defaultPrefs;
    } catch (error) {
      console.error("Error resetting preferences:", error);
      throw error;
    }
  }
}

export default new UserPreferencesService();