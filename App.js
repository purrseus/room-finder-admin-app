import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, UIManager } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OverlayLoading, {
  overlayLoadingRef,
} from './src/components/OverlayLoading';
import ToastNotification, {
  toastNotificationRef,
} from './src/components/ToastNotification';
import RootStack from './src/navigation/RootStack';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ActionSheetProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <ToastNotification ref={toastNotificationRef} />
            <RootStack />
            <OverlayLoading ref={overlayLoadingRef} />
          </NavigationContainer>
        </ActionSheetProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
