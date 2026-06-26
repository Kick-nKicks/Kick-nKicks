import './global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBackground } from './src/components/AppBackground';
import { AppErrorBoundary } from './src/components/AppErrorBoundary';
import { AuthProvider } from './src/hooks/useAuth';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppErrorBoundary>
          <AuthProvider>
            <AppBackground>
              <AppNavigator />
              <StatusBar style="dark" />
            </AppBackground>
          </AuthProvider>
        </AppErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
