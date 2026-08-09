/**
 * Land Calculator PWA - LocalStorage Manager
 * Persists history, saved plot lists, and user presets locally on device.
 */

const STORAGE_KEYS = {
  HISTORY: 'land_calc_history',
  PRESETS: 'land_calc_presets',
  SETTINGS: 'land_calc_settings'
};

export const StorageManager = {
  /**
   * Get all calculation history records
   */
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading history from storage:', e);
      return [];
    }
  },

  /**
   * Save a calculation record to history
   */
  saveRecord(record) {
    try {
      const history = this.getHistory();
      const newRecord = {
        id: 'rec_' + Date.now(),
        timestamp: new Date().toISOString(),
        ...record
      };
      history.unshift(newRecord); // add to top
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 100))); // keep top 100
      return newRecord;
    } catch (e) {
      console.error('Error saving record to storage:', e);
      return null;
    }
  },

  /**
   * Delete a record from history by ID
   */
  deleteRecord(id) {
    try {
      const history = this.getHistory().filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      return true;
    } catch (e) {
      console.error('Error deleting record from storage:', e);
      return false;
    }
  },

  /**
   * Clear all history
   */
  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Get user preferences / settings
   */
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { defaultUnit: 'sqft', theme: 'dark' };
    } catch (e) {
      return { defaultUnit: 'sqft', theme: 'dark' };
    }
  },

  /**
   * Update user preferences / settings
   */
  saveSettings(settings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return null;
    }
  }
};
