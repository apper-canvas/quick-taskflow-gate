import categoriesData from '@/services/mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await delay(250);
    return [...this.categories];
  }

  async getById(id) {
    await delay(200);
    const category = this.categories.find(c => c.id === id);
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    this.categories[index] = { ...this.categories[index], ...updates };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    this.categories.splice(index, 1);
    return true;
  }

  async updateTaskCount(categoryId, count) {
    await delay(200);
    const index = this.categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      this.categories[index].taskCount = count;
      return { ...this.categories[index] };
    }
    return null;
  }
}

export default new CategoryService();