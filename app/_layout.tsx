import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import { Stack, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AppSidebarDrawer } from '@/components/Sidebar/AppSidebar';
import {
  CommonActions,
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';
import ToastInstance from '@/components/ToastInstance';
import LoadingModal from '@/components/global/LoadingModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { PermissionsAndroid, Platform } from 'react-native';
import { toastResponseMessage } from '@/utils/toast';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    ...FontAwesome.font,
    'InterTight-Regular': require('@/assets/fonts/InterTight-Regular.ttf'),
    'InterTight-Bold': require('@/assets/fonts/InterTight-Bold.ttf'),
    'InterTight-Black': require('@/assets/fonts/InterTight-Black.ttf'),
    'InterTight-ExtraBold': require('@/assets/fonts/InterTight-ExtraBold.ttf'),
    'InterTight-ExtraLight': require('@/assets/fonts/InterTight-ExtraLight.ttf'),
    'InterTight-Light': require('@/assets/fonts/InterTight-Light.ttf'),
    'InterTight-Medium': require('@/assets/fonts/InterTight-Medium.ttf'),
    'InterTight-SemiBold': require('@/assets/fonts/InterTight-SemiBold.ttf'),
    'InterTight-Thin': require('@/assets/fonts/InterTight-Thin.ttf'),
    'Oswald-Regular': require('@/assets/fonts/Oswald-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <></>;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const navigation = useNavigation();
  const { currentUser, initialize } = useAuthStore();
  useEffect(() => {
    const onInitialize = async () => {
      await initialize();
    };
    onInitialize();
  }, [initialize]);

  useEffect(() => {
    console.log('currentUser', currentUser);
    if (currentUser) {
      navigation.dispatch(CommonActions.navigate('TabsLayout'));
    } else {
      navigation.navigate('Welcome' as never);
    }
  }, [currentUser]);
  return (
    <ThemeProvider value={DarkTheme}>
      <AppSidebarDrawer>
        <LoadingModal />
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
          </GestureHandlerRootView>

          <StatusBar style="light" translucent />
        </QueryClientProvider>
        <ToastInstance />
      </AppSidebarDrawer>
    </ThemeProvider>
  );
}
