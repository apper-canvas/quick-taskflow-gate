import preferencesData from '@/services/mockData/userPreferences.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserPreferencesService {
  constructor() {
    this.preferences = { ...preferencesData };
  }

  async get() {
    await delay(200);
    return { ...this.preferences };
  }

  async update(updates) {
    await delay(300);
    this.preferences = { ...this.preferences, ...updates };
    return { ...this.preferences };
  }

  async reset() {
    await delay(250);
    this.preferences = { ...preferencesData };
    return { ...this.preferences };
  }
}

export default new UserPreferencesService();