import { toast } from 'react-toastify';

class TaskService {
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

  async getAll() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id']
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id']
      };
      
      const response = await this.apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          status: taskData.status,
          created_at: taskData.createdAt || new Date().toISOString(),
          reminder_time: taskData.reminderTime,
          category_id: parseInt(taskData.categoryId),
          parent_task_id: taskData.parentTaskId ? parseInt(taskData.parentTaskId) : null
        }]
      };
      
      const response = await this.apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.reminder_time !== undefined) updateData.reminder_time = updates.reminder_time;
      if (updates.reminderTime !== undefined) updateData.reminder_time = updates.reminderTime;
      if (updates.category_id !== undefined) updateData.category_id = parseInt(updates.category_id);
      if (updates.categoryId !== undefined) updateData.category_id = parseInt(updates.categoryId);
      if (updates.parent_task_id !== undefined) updateData.parent_task_id = updates.parent_task_id ? parseInt(updates.parent_task_id) : null;
      if (updates.parentTaskId !== undefined) updateData.parent_task_id = updates.parentTaskId ? parseInt(updates.parentTaskId) : null;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('task', params);
      
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
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async getByCategory(categoryId) {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id'],
        where: [{
          FieldName: "category_id",
          Operator: "ExactMatch",
          Values: [parseInt(categoryId)]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id'],
        where: [{
          FieldName: "status",
          Operator: "ExactMatch",
          Values: [status]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  }

  async getOverdue() {
    try {
      const now = new Date().toISOString();
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id'],
        whereGroups: [{
          operator: "AND",
          SubGroups: [{
            conditions: [{
              FieldName: "status",
              Operator: "NotEqualTo",
              Values: ["completed"]
            }],
            operator: ""
          }, {
            conditions: [{
              FieldName: "due_date",
              Operator: "LessThan",
              Values: [now]
            }],
            operator: ""
          }]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      return [];
    }
  }

  async getDueToday() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id'],
        whereGroups: [{
          operator: "AND",
          SubGroups: [{
            conditions: [{
              FieldName: "due_date",
              Operator: "GreaterThanOrEqualTo",
              Values: [today.toISOString()]
            }],
            operator: ""
          }, {
            conditions: [{
              FieldName: "due_date",
              Operator: "LessThan",
              Values: [tomorrow.toISOString()]
            }],
            operator: ""
          }]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      return [];
    }
  }

  async getUpcoming() {
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id'],
        whereGroups: [{
          operator: "AND",
          SubGroups: [{
            conditions: [{
              FieldName: "due_date",
              Operator: "GreaterThan",
              Values: [today.toISOString()]
            }],
            operator: ""
          }, {
            conditions: [{
              FieldName: "due_date",
              Operator: "LessThanOrEqualTo",
              Values: [nextWeek.toISOString()]
            }],
            operator: ""
          }, {
            conditions: [{
              FieldName: "status",
              Operator: "NotEqualTo",
              Values: ["completed"]
            }],
            operator: ""
          }]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      return [];
    }
  }

  async getStats() {
    try {
      const allTasks = await this.getAll();
      const total = allTasks.length;
      const completed = allTasks.filter(t => t.status === 'completed').length;
      const pending = allTasks.filter(t => t.status === 'pending').length;
      const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
      const now = new Date();
      const overdue = allTasks.filter(t => 
        t.status !== 'completed' && new Date(t.due_date) < now
      ).length;

      return {
        total,
        completed,
        pending,
        inProgress,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    } catch (error) {
      console.error("Error fetching task stats:", error);
      throw error;
    }
  }

  async getSubtasks(parentId) {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id'],
        where: [{
          FieldName: "parent_task_id",
          Operator: "ExactMatch",
          Values: [parseInt(parentId)]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      return [];
    }
  }

  async createSubtask(parentId, taskData) {
    try {
      const subtaskData = {
        ...taskData,
        parent_task_id: parseInt(parentId)
      };
      return await this.create(subtaskData);
    } catch (error) {
      console.error("Error creating subtask:", error);
      throw error;
    }
  }

  async getParentTasks() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 'status', 'created_at', 'reminder_time', 'category_id', 'parent_task_id'],
        where: [{
          FieldName: "parent_task_id",
          Operator: "DoesNotHaveValue",
          Values: []
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching parent tasks:", error);
      return [];
    }
  }

  async getTaskWithSubtasks(taskId) {
    try {
      const task = await this.getById(taskId);
      if (!task) return null;
      
      const subtasks = await this.getSubtasks(taskId);
      return {
        ...task,
        subtasks
      };
    } catch (error) {
      console.error("Error fetching task with subtasks:", error);
      return null;
    }
  }

  async updateSubtaskOrder(parentId, subtaskIds) {
    try {
      // This would typically update order in database
      // For now, just return the subtasks
      return await this.getSubtasks(parentId);
    } catch (error) {
      console.error("Error updating subtask order:", error);
      return [];
    }
  }

  async getSubtaskProgress(parentId) {
    try {
      const subtasks = await this.getSubtasks(parentId);
      if (subtasks.length === 0) return { total: 0, completed: 0, percentage: 0 };
      
      const completed = subtasks.filter(t => t.status === 'completed').length;
      return {
        total: subtasks.length,
        completed,
        percentage: Math.round((completed / subtasks.length) * 100)
      };
    } catch (error) {
      console.error("Error fetching subtask progress:", error);
      return { total: 0, completed: 0, percentage: 0 };
    }
  }
}

export default new TaskService();