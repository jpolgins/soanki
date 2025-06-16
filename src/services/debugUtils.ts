import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Debug utility functions for AsyncStorage
 * These functions are intended for development use only.
 */

// Debug helper to print all keys and values in AsyncStorage
export const debugAsyncStorage = async () => {
  if (__DEV__) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.info('All AsyncStorage keys:', keys);
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        console.info(`Key: ${key}, Value:`, value ? JSON.parse(value) : null);
      }
    } catch (error) {
      console.error('Error debugging AsyncStorage:', error);
    }
  }
};

// Clear all data from AsyncStorage (for testing)
export const clearAllData = async () => {
  if (__DEV__) {
    try {
      await AsyncStorage.clear();
      console.info('All data cleared from AsyncStorage');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }
};
