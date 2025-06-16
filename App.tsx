import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { debugAsyncStorage } from './src/services/debugUtils';
import { COLORS } from './src/styles/theme';

export default function App() {
  // Debug AsyncStorage on app startup
  useEffect(() => {
    debugAsyncStorage();
  }, []);
  
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="light" backgroundColor={COLORS.primary} />
    </SafeAreaProvider>
  );
}
