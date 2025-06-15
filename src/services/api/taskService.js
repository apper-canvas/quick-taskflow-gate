import tasksData from '@/services/mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks.splice(index, 1);
    return true;
  }

  async getByCategory(categoryId) {
    await delay(200);
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  }

  async getByStatus(status) {
    await delay(200);
    return this.tasks.filter(t => t.status === status).map(t => ({ ...t }));
  }

  async getOverdue() {
    await delay(200);
    const now = new Date();
    return this.tasks.filter(t => 
      t.status !== 'completed' && 
      new Date(t.dueDate) < now
    ).map(t => ({ ...t }));
  }

  async getDueToday() {
    await delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    }).map(t => ({ ...t }));
  }

  async getUpcoming() {
    await delay(200);
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return this.tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate > today && dueDate <= nextWeek && t.status !== 'completed';
    }).map(t => ({ ...t }));
  }

  async getStats() {
    await delay(250);
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.status === 'completed').length;
    const pending = this.tasks.filter(t => t.status === 'pending').length;
    const inProgress = this.tasks.filter(t => t.status === 'in-progress').length;
    const overdue = this.tasks.filter(t => 
      t.status !== 'completed' && new Date(t.dueDate) < new Date()
    ).length;

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
}

export default new TaskService();